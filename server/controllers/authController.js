import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {

    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.json({success: false , message: "Please fill all fields"});
    }

    try{
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bycrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        })
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Sending welcome email
        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: email,
        //     subject: 'Welcome to MERN Auth',
        //     text: `Welcome to MERN Auth. Your account has been created with email id: ${email}.`
        // }

        // await transporter.sendMail(mailOptions);


        return res.json({success: true, message: "Registration successful"});

    }
    catch(error){
        return res.json({success: false, message: "Internal server error"});
    }
}

export const login = async (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.json({success: false, message: "Please fill all fields"});
    }

    try{
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({success: false, message: "Invalid credentials"});
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return res.json({success: true, message: "Login successful"});
    }
    catch(error){
        console.error("Error in login:", error);
        return res.json({success: false, message: "Internal server error"});
    }

}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({success: true, message: "Logout successful"});

    } catch (error) {
        return res.json({success: false, message: "Internal server error"});
    }
}

// Send verification OTP to user's email
export const sendVerifyOtp = async (req, res) => {
    try{
        const {userId} = req.user;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.json({success: false, message: "Account already verified"});
        }

        const otp = String(Math.floor(100000  + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify your account',
            text: `Your verification OTP is ${otp}. verify your account within 24 hours.`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Verification OTP sent to your email"});

    }
    catch(error){
        return res.json({success: false, message: "Internal server error"});
    }
}

export const verifyEmail = async (req, res) => {
    console.log(req.body)
    
    const {otp} = req.body;
    const {userId} = req.user;

    console.log("Verifying email for userId:", userId, "with OTP:", otp);

    if (!userId || !otp) {
        return res.json({success: false, message: "Missing Details"});
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        
        await user.save();
        return res.json({success: true, message: "Account verified successfully"});

    }
    catch (error) {
        console.error("Error in verifyEmail:", error);
        return res.json({success: false, message: "Internal server error"});
    }

}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        console.error("Error in isAuthenticated:", error);
        return res.json({success: false, message: "Internal server error"});
    }
}

// Send Password Resrt OTP
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.json({success: false, message: "Please provide email"});
    }
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({success: false, message: "User not found"});
        }
        const otp = String(Math.floor(100000  + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset your password',
            text: `Your password reset OTP is ${otp}. Reset your password within 15 minutes.`
        };
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Password reset OTP sent to your email"});

    }catch(error) {
        return res.json({success: false, message: "Internal server error"});
    }
}

// Reset Password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({success: false, message: "Please fill all fields"});
    }
    try{
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired"});
        }

        const hashedPassword = await bycrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: "Password reset successful"});


    }catch (error) {
        return res.json({success: false, message: "Internal server error"});
    }
}