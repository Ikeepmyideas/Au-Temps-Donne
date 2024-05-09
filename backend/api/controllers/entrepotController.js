const multer = require('multer');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const { Op } = require('sequelize'); 
const argon2 = require('argon2');

require('dotenv').config(); 
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
  
        const admin = await Admin.findOne({ where: { email } });
  
        if (!admin) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        const passwordMatch = await argon2.verify(admin.mot_de_passe, password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
  
  
        const token = generateToken(admin.id,  admin.email);
  
        const userType = "admin"
  
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            sameSite: 'none',
            path: '/', // Set the cookie path to '/'
            secure: true // Add 'secure: true' if your app is served over HTTPS
        });
  
        res.status(200).json({ message: 'Login successful', token, userType }); 
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
