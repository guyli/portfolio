import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Configure Nodemailer transporter with Gmail
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.MY_GMAIL_USER,
    //         pass: process.env.MY_GMAIL_APP_PASS,
    //     },
    // });

    // Configure Nodemailer transporter with Zoho Mail
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // SSL
        auth: {
            user: process.env.ZOHO_USER, // guy@guylivne.com
            pass: process.env.ZOHO_APP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact Form" <${process.env.ZOHO_USER}>`,
            to: process.env.ZOHO_USER, // Sends to guy@guylivne.com
            replyTo: email, // Clicking "Reply" in Gmail replies directly to the sender
            subject: `New Inquiry to guylivne.com from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">New Message to guylivne.com</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>
                </div>
            `,
        });

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Nodemailer Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to send email.' });
    }
}