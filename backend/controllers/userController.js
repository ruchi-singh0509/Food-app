import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import mongoSanitize from "express-mongo-sanitize"

//Login-User
const loginUser = async (req, res) => {
    try {
        // Sanitize inputs
        const sanitizedInput = mongoSanitize.sanitize(req.body);
        const { email, password } = sanitizedInput;
        
        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email address" 
            });
        }
        
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Create and send token
        const token = createToken(user._id);
        
        // Set token as HTTP-only cookie for better security
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        
        res.status(200).json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during login" 
        });
    }
}

const createToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' } // Token expires in 1 day
    );
}
//Register-user
const registerUser = async (req, res) => {
    try {
        // Sanitize inputs
        const sanitizedInput = mongoSanitize.sanitize(req.body);
        const { name, password, email } = sanitizedInput;
        
        // Validate required fields
        if (!name || !password || !email) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, email, and password are required" 
            });
        }
        
        // Validate name
        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({ 
                success: false, 
                message: "Name must be between 2 and 50 characters" 
            });
        }
        
        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email address" 
            });
        }
        
        // Check if email already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ 
                success: false, 
                message: "Email is already registered" 
            });
        }
        
        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 8 characters long" 
            });
        }
        
        if (!validator.isStrongPassword(password, {
            minLength: 8, 
            minLowercase: 1, 
            minUppercase: 1, 
            minNumbers: 1, 
            minSymbols: 0
        })) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name: validator.escape(name.trim()), // Sanitize name
            email: validator.normalizeEmail(email), // Normalize email
            password: encryptPassword
        });

        // Save user to database
        const user = await newUser.save();
        
        // Create token
        const token = createToken(user._id);
        
        // Set token as HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        
        res.status(201).json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during registration" 
        });
    }
}

// Get current user profile
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving user data"
        });
    }
};

// Logout user
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export { loginUser, registerUser, getCurrentUser, logoutUser };