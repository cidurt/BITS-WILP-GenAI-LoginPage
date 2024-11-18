const axios = require('axios');

exports.checkFraud = async (req, res) => {
  const { userId, activityData } = req.body; // Receive user data

  try {
    // Call the ML service
    const response = await axios.post(process.env.ML_API_URL, activityData);
    const { is_fraudulent } = response.data;

    res.json({
      userId,
      isFraudulent: is_fraudulent,
      message: is_fraudulent ? 'Fraudulent activity detected' : 'Activity is legitimate',
    });
  } catch (error) {
    console.error('Error calling ML service:', error.message);
    res.status(500).json({ error: 'Error detecting fraud' });
  }
};
