const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Partenaire = require('../models/Partenaire');
const nodemailer = require('nodemailer');

// Function to send a welcome email
const sendWelcomeEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Bienvenue chez notre plateforme!',
        text: `Bonjour ${name},\n\nBienvenue sur notre plateforme !`,
        html: `<p>Bonjour <strong>${name}</strong>,</p><p>Bienvenue sur notre plateforme !</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email', error);
    }
};

const registerPartenaire = async (req, res) => {
    try {
        const { nom, email, password, telephone, adresse } = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the partenaire
        const newPartenaire = await Partenaire.create({
            nom,
            email,
            password: hashedPassword,
            telephone,
            adresse
        });

        // Send welcome email
        await sendWelcomeEmail(email, nom);

        res.status(201).json({ message: 'Registration successful', partenaire: newPartenaire });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loginPartenaire = async (req, res) => {
    try {
        const { email, password } = req.body;

        const partenaire = await Partenaire.findOne({ where: { email } });
        if (!partenaire) {
            return res.status(404).json({ error: 'Partenaire not found' });
        }

        const validPassword = await bcrypt.compare(password, partenaire.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: partenaire.id, email: partenaire.email }, 'your_secret_key_here', { expiresIn: '1h' });

        // Set the token as a cookie in the response
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, 
            sameSite: 'strict',
            path: '/', 
        });

        // Respond with a success message
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { registerPartenaire, loginPartenaire };
