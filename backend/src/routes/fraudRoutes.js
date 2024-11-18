const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

// Fraud detection endpoint
router.post('/fraud-check', async (req, res) => {
  const {
    timeToEnterNumber,
    timeToClickGetSMS,
    timeToEnterOTP,
    mouseMovements,
    buttonClickPosition,
    deviceInfo,
  } = req.body;

  if (
    timeToEnterNumber === undefined ||
    timeToClickGetSMS === undefined ||
    timeToEnterOTP === undefined ||
    mouseMovements === undefined ||
    buttonClickPosition.getSMS === undefined ||
    buttonClickPosition.login === undefined ||
    !deviceInfo
  ) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  console.log(timeToEnterNumber, deviceInfo)

  const messages = [
    {
      role: 'system',
      content:
        'You are an AI fraud detection assistant. Based on the user activity data provided, determine if the user is "Fake" or "Genuine" and explain your reasoning.',
    },
    {
      role: 'user',
      content: `
        Based on the following data, classify the user as "Fake" or "Genuine":

    - Time to Enter Number: ${timeToEnterNumber} seconds  
      (Average time per character in seconds.)
    - Time to Click Get SMS: ${timeToClickGetSMS} seconds  
      (Time elapsed between entering the phone number and clicking the "Get SMS" button.)
    - Time to Enter OTP: ${timeToEnterOTP} seconds  
      (Time elapsed between starting OTP input and clicking the "Login" button.)
    - Mouse Movements: ${mouseMovements}  
      (Total number of mouse movements during the session.)
    - Button Click Position (X, Y):  
      - Get SMS Button: (${buttonClickPosition.getSMS})  
      - Login Button: (${buttonClickPosition.login})  
      (If the click positions for both buttons are identical, it may indicate automated activity.)
    - Device Info: ${JSON.stringify(deviceInfo)}  
      (Check for unusual device characteristics, such as headless browsers or uncommon platforms.)

    Rules:
    1. If the average time per character input for the phone number is unusually fast (<0.1 seconds), classify as "Fake."
    2. If the time to click "Get SMS" is below 1 second, classify as "Fake."
    3. If the time to enter OTP is below 1 seconds, classify as "Fake."
    4. If total mouse movements are below 30, classify as "Fake."
    5. If the click positions for "Get SMS" and "Login" buttons are identical, classify as "Fake."
    6. If the device info suggests a headless browser, unusual user agent, or mismatched platform, classify as "Fake."

    Remember it's going to be a combination of all. One parameter here and there does not make it fake. But if it is significantly varying then yes even one parameter is enough to clasify as fake.
    Use your human like logic to check all parameter and come up with a combined conclusion okay?

    Remember to responsd with only "Fake" if it is fake or "Genuine" if it is genuine. Give the request benifit of doubt if it's a border case!!!! nothing else. no other gibberish please
      `,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Specify GPT-4 model
      messages: messages,
      max_tokens: 200,
    });

    const result = response.choices[0].message.content.trim();
    console.log(result)
    if (result === 'Genuine'){
        res.status(200).json({ result });
    } else {
        res.status(401).json({ result });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to process fraud detection.' });
  }
});

module.exports = router;
