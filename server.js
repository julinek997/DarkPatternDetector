const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Define an endpoint to receive feedback
app.post('/submit-feedback', (req, res) => {
  const feedbackText = req.body.feedbackText;

  // Send email
  const mailOptions = {
    from: 'darkpatterndetector@gmail.com',
    to: 'darkpatterndetector@gmail.com', 
    subject: 'Feedback from Dark Pattern Detector',
    text: feedbackText,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Feedback submitted successfully!');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
