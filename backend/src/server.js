const app = require('./app');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 5000;

require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());

// Environment variables
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

// Route: Request OTP
app.post('/api/request-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    console.log(CLIENT_ID, CLIENT_SECRET)
    const response = await axios.post(`https://${AUTH0_DOMAIN}/passwordless/start`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      connection: 'sms', // SMS connection
      phone_number: phoneNumber,
      send: 'code', // Send a one-time code
    });

    res.json({ message: 'OTP sent successfully', response: response.data });
  } catch (error) {
    console.error('Error requesting OTP:', error.response.data);
    res.status(500).json({ error: 'Failed to request OTP' });
  }
});

// Route: Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: phoneNumber,
      otp: otp,
      realm: 'sms', // SMS connection
    });
    console.log(response.data)
    res.json({ message: 'Authentication successful', token: response.data });
  } catch (error) {
    console.error('Error verifying OTP:', error.response.data);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});


sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
