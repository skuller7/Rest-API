const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generiši JWT Token
const generateToken = (id) => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.EXPIRE || '30d'
    });
};

// Register korisnika
const register = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        // Validacija
        if (!name || !surname || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Proveri da li korisnik već postoji
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kreiraj korisnika
        const user = await User.create({
            name,
            surname,
            email,
            password: hashedPassword,
            role: 'user' // Default role
        });

        // Generiši token
        const token = generateToken(user._id);

        // Vrati korisnika i token (bez passworda)
        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login korisnika
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validacija
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Pronađi korisnika (uključi password za proveru)
        // select: false u modelu znači da treba eksplicitno da selektujemo password sa +password
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Proveri password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generiši token
        const token = generateToken(user._id);

        // Vrati korisnika i token (bez passworda)
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current logged in user
const getMe = async (req, res) => {
    try {
        // req.user je postavljen u auth.middleware.js
        const user = await User.findById(req.user._id).select('-password');
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe
};
