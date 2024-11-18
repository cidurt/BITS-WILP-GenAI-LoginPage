import React, { useState } from 'react';
import axios from 'axios';

const CustomLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('enterPhone'); // Steps: enterPhone, enterOTP
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    try {
      const response = await axios.post('/api/request-otp', { phoneNumber });
      setStep('enterOTP');
      setMessage('OTP sent successfully!');
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/api/verify-otp', { phoneNumber, otp });
      setMessage('Authentication successful! Token received.');
      console.log('Token:', response.data.token);
    } catch (error) {
      setMessage('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Custom Login</h2>
      {message && <p>{message}</p>}
      {step === 'enterPhone' && (
        <>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={requestOtp}>Request OTP</button>
        </>
      )}
      {step === 'enterOTP' && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
};

export default CustomLogin;
