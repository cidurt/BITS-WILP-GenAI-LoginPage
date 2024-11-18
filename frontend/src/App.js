import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('enterPhone'); // Steps: enterPhone, enterOTP
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track OTP verification status
  const [activityData, setActivityData] = useState({
    mouseMovements: 0,
    timeToEnterNumber: 0,
    timeToClickGetSMS: 0,
    timeToEnterOTP: 0,
    buttonClickPosition: { getSMS: null, login: null },
    deviceInfo: {},
  });

  const [startTypingTime, setStartTypingTime] = useState(null); // When typing begins
  const [typingEndTime, setTypingEndTime] = useState(null); // When typing ends
  const [otpStartTime, setOtpStartTime] = useState(null);
  const [charTimes, setCharTimes] = useState([]); // Track time for each character input
  const [lastCharTime, setLastCharTime] = useState(null); // Store the timestamp of the last keystroke


  useEffect(() => {
    // Track mouse movements
    const handleMouseMove = () => {
      setActivityData((prev) => ({
        ...prev,
        mouseMovements: prev.mouseMovements + 1,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Capture device info
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };
    setActivityData((prev) => ({ ...prev, deviceInfo }));
  }, []);

  const handlePhoneChange = (e) => {
    const currentTime = Date.now();
  
    // Set startTypingTime when the user begins typing
    if (!startTypingTime) {
      setStartTypingTime(currentTime);
    }
  
    setPhoneNumber(e.target.value);
  
    // Calculate interval between keystrokes
    if (lastCharTime) {
      const interval = currentTime - lastCharTime;
      setCharTimes((prev) => [...prev, interval]); // Store only the interval
    }
  
    // Update lastCharTime for the next keystroke
    setLastCharTime(currentTime);
  
    // Update typingEndTime on every keystroke
    setTypingEndTime(currentTime);
  
    console.log('Char Times (Intervals):', charTimes); // Debug: Verify intervals
  };
  

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  
    // Initialize otpStartTime when typing OTP starts
    if (!otpStartTime) {
      setOtpStartTime(Date.now());
    }
  
    console.log('OTP Start Time:', otpStartTime); // Debug: Verify OTP start time
  };

  const handleGetSMSClick = (e) => {
    const buttonPosition = { x: e.clientX, y: e.clientY };
    const currentTime = Date.now();
  
    // Calculate time to enter phone number
    const timeToEnterNumber = typingEndTime
      ? typingEndTime - startTypingTime
      : 0; // Fallback if typingEndTime is not set
  
    // Calculate time between finishing typing and clicking "Get SMS"
    const timeToClickGetSMS = typingEndTime ? currentTime - typingEndTime : 0;
  
    // Calculate average character typing time
    const avgCharTime =
      charTimes.length > 1
        ? charTimes.reduce((sum, interval) => sum + interval, 0) / charTimes.length
        : 0;
  
    // Prepare updated activity data
    const updatedActivityData = {
      ...activityData,
      timeToEnterNumber: timeToEnterNumber / 1000, // Convert to seconds
      avgCharTime: avgCharTime / 1000, // Convert to seconds
      timeToClickGetSMS: timeToClickGetSMS / 1000, // Convert to seconds
      buttonClickPosition: { ...activityData.buttonClickPosition, getSMS: buttonPosition },
    };
  
    // Log updated activity data for debugging
    console.log('Activity Data After Get SMS:', updatedActivityData);
  
    // Update state
    setActivityData(updatedActivityData);
  
    // Request OTP
    requestOtp();
  };
  

  const handleLoginClick = async (e) => {
    const buttonPosition = { x: e.clientX, y: e.clientY };
    const currentTime = Date.now();
  
    // Calculate time to enter OTP
    const timeToEnterOTP = otpStartTime ? currentTime - otpStartTime : 0; // Fallback to 0 if otpStartTime is not set
  
    // Update activity data
    const updatedActivityData = {
      ...activityData,
      timeToEnterOTP: timeToEnterOTP / 1000, // Convert to seconds
      buttonClickPosition: { ...activityData.buttonClickPosition, login: buttonPosition },
    };
  
    console.log('Activity Data After Login:', updatedActivityData); // Debug: Verify activity data
  
    try {
      // Call the verify OTP endpoint
      const fraudResponse = await axios.post('http://localhost:5010/fraud/fraud-check', updatedActivityData);
      if (fraudResponse.data.result === "Genuine") {

        // Send activity data for fraud detection
        
        const fraudResult = fraudResponse.data.result;

        setMessage(`Login successful! Fraud Check Result: ${fraudResult}`);
      } else {
        setMessage('Failed to verify OTP. Please try again.');
      }
      const response = await axios.post('http://localhost:5010/api/verify-otp', { phoneNumber, otp });
      setAccessToken(response.data.token);
      setIsVerified(true)

      // If OTP verification is successful, perform fraud check
      
    } catch (error) {
      console.error('Error verifying OTP or checking fraud:', error);
      setMessage('Failed to verify OTP or process fraud check. Please try again.');
    }
  };

  const requestOtp = async () => {
    try {
      await axios.post('http://localhost:5010/api/request-otp', { phoneNumber });
      setStep('enterOTP');
      setMessage('OTP sent successfully!');
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    // try {
    //   // Call the verify OTP endpoint
    //   const fraudResponse = await axios.post('http://localhost:5010/fraud/fraud-check', activityData);
    //   if (fraudResponse.data.result === "Genuine") {

    //     // Send activity data for fraud detection
        
    //     const fraudResult = fraudResponse.data.result;

    //     setMessage(`Login successful! Fraud Check Result: ${fraudResult}`);
    //   } else {
    //     setMessage('Failed to verify OTP. Please try again.');
    //   }
    //   const response = await axios.post('http://localhost:5010/api/verify-otp', { phoneNumber, otp });
    //   setAccessToken(response.data.token);

    //   // If OTP verification is successful, perform fraud check
      
    // } catch (error) {
    //   console.error('Error verifying OTP or checking fraud:', error);
    //   setMessage('Failed to verify OTP or process fraud check. Please try again.');
    // }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#ffffff',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <LockOutlinedIcon sx={{ fontSize: 50, color: '#1976d2', marginBottom: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Jalan Company
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Secure Login Portal
        </Typography>

        {/* Display Message */}
        {message && <Alert severity="info" sx={{ marginBottom: 2 }}>{message}</Alert>}

        {/* Step: Enter Phone Number */}
        {step === 'enterPhone' && (
          <>
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleGetSMSClick}
              sx={{ padding: 1 }}
            >
              Request OTP
            </Button>
          </>
        )}

        {/* Step: Enter OTP */}
        {step === 'enterOTP' && !isVerified && (
          <>
            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={handleOtpChange}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
              sx={{ padding: 1 }}
            >
              Verify OTP
            </Button>
          </>
        )}

        {/* Display Access Token if Verified */}
        {isVerified && (
          <Box sx={{ marginTop: 3, textAlign: 'left' }}>
            <Typography variant="subtitle1" gutterBottom>
              Access Token:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                wordBreak: 'break-word',
                backgroundColor: '#f5f5f5',
                padding: 2,
                borderRadius: 1,
                border: '1px solid #ddd',
              }}
            >
              {JSON.stringify(accessToken, null, 2)}
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="caption" color="textSecondary">
            &copy; 2024 Jalan Company. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
