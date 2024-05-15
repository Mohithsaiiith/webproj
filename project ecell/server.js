const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomize = require('randomatic');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "28e08f5e45daba30b549305aa96ca581"
    }
  });


function generateOTP() {
    return randomize('0', 6); 
}


app.post('/verify-otp', (req, res) => {
    const { firstName, lastName, email, otp } = req.body;

    
    const generatedOTP = generateOTP();

    
    const mailOptions = {
        from: 'sender@example.com',
        to: email,
        subject: 'OTP Verification',
        text: `Hello ${firstName} ${lastName},\n\nYour OTP for email verification is: ${generatedOTP}`
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP email:', error);
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
        console.log('OTP email sent:', info.response);

        
        if (otp === generatedOTP) {
            return res.status(200).json({ message: 'OTP verified successfully. Account is verified!' });
        } else {
            return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
