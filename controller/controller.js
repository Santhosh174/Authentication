require('dotenv').config();
const user = require('../models/users')
const jwt = require('jsonwebtoken')
const UserOTPVerification = require('../models/UserOTPVerification')
const bcrypt = require('bcrypt'); 
const nodemailer = require('nodemailer'); 
const ObjectId = require('mongodb').ObjectId;

const crypto = require('crypto');
const initiatePasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const User = await user.findOne({ email });
        if (!User) {
            return res.status(400).json({ error: 'No user with that email' });
        }

        // Generate a reset token
        const token = crypto.randomBytes(32).toString('hex');
        User.resetToken = token;
        User.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await User.save();


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'santhoshcse18@gmail.com',
                pass: 'rswb cvty xcfa unoj',
            },
        });

        const mailOptions = {
            to: User.email,
            from: 'santhoshcse18@gmail.com',
            subject: 'FlipZon Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const User = await user.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!User) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        User.password = password;
        User.resetToken = undefined;
        User.resetTokenExpiry = undefined;
        await User.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
const handleErrors = (err) =>{
    console.log(err.message,err.code);
    let errors = {email :'',password:''};

    //incorrect email
    if(err.message == 'Incorrect Email'){
        errors.email = 'That email is not registered'
    }
    if(err.message == 'Incorrect Password'){
        errors.email = 'That Password in incorrect';
    }

    //duplicate email error
    if(err.code == 11000){
        errors.email = 'This email is already registered';
        return errors;
    }

    //validation error
    if(err.message.includes('auth_user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
 const createToken = (id) =>{
    return jwt.sign({id},'santhosh secret',{
        expiresIn : maxAge
    })
 }

const index = (req,res) => {
    res.render('index',{title: "Home"});
}
const product = (req,res) => {
    res.render('product',{title: "Products"})
}
const details = (req,res) => {
    const product = req.query.product;
    res.render('details', { title: product ,product });
}
const signin = (req,res) => {
    res.render('signin')
}
const signup = (req,res) => {
    res.render('signup')
}
const rp = (req,res) => {
    res.render('reset-password')
}
const otpp = (req,res) => {
    const { tempUserId , email} = req.query;
    res.render('otp', { tempUserId,email });
}
const profile = (req,res) => {
    res.render('profile', { title: "profile" })
}
const signin_post = async(req,res) => {
    const {email,password} = req.body;
    try{
        const new_user = await user.login(email,password);
        const token = createToken(new_user._id)
        res.cookie('jwt',token,{ httpOnly: true , maxAge : maxAge *1000})
        res.status(200).json({new_user:new_user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}

const tempUserStorage = new Map(); 

const signup_post = async (req, res) => {
    const { email, name, password } = req.body;
    try {

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: { email: 'Email is already registered' } });
        }

        const tempUserId = new ObjectId().toString(); 
        tempUserStorage.set(tempUserId, { email, name, password });

        const otpResponse = await sendOTP({ _id: tempUserId, email });
        res.status(201).json({ 
            tempUserId, 
            otpResponse,
            email
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};
 let transporter = nodemailer.createTransport({
    host : "smtp-mail.outlook.com",
    port: 587, 
    secure: false, 
    auth : {
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS,
    },
 })

const logout = (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

//otp
const sendOTP = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOption = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'FlipZon : Verify Your Email',
            html: `<p> Enter <b style="color: blue;">${otp}</b> in the app to verify your email address and complete the signup process. </p> <p>This code expires in <b>1 hour</b></p>`
        };
        const saltRounds = 10;
        const hashedotp = await bcrypt.hash(otp, saltRounds); 
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedotp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOption);
        return( {
            status: "PENDING",
            message: "Verification OTP mail sent",
            data: {
                userId: _id,
                email,
            }
        });
    } catch (err) {
        console.error("Error sending OTP email:", err);
        throw new Error("Failed to send OTP email.");
    }
};
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

//verify otp
const verifyotp = async (req, res) => {
    try {
        let { userId, otp } = req.body;
        if (!userId || !otp) {
            throw Error("Empty OTP or userId are not allowed");
        }

        const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });

        if (UserOTPVerificationRecords.length <= 0) {
            throw Error("Account record doesn't exist. Please sign up.");
        }

        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            throw new Error("Code has expired. Please request again.");
        }

        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.");
        }

        const tempUserData = tempUserStorage.get(userId);
        if (!tempUserData) {
            throw new Error("User data not found. Please sign up again.");
        }

        // Create user in the database
        const newUser = await user.create(tempUserData);
        await UserOTPVerification.deleteMany({ userId });
        tempUserStorage.delete(userId); 
        const token = createToken(newUser._id)
        res.cookie('jwt',token,{ httpOnly: true , maxAge : maxAge *1000})

        res.json({
            status: "VERIFIED",
            message: "User email verified successfully",
            new_user: newUser._id,
        });
    } catch (err) {
        res.json({
            status: "FAILED",
            message: err.message,
        });
    }
};


//resend otp
const resendotp = async (req, res) => {
    try {
        let { userId, email } = req.body;
        if (!userId || !email) {
            throw Error("Empty user details are not allowed");
        } else {
            await UserOTPVerification.deleteMany({ userId });
            const otpResponse = await sendOTP({ _id: userId, email });
            res.status(200).json({
                status: "SUCCESS",
                message: "OTP resent successfully",
                otpResponse
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "FAILED",
            message: err.message
        });
    }
};


const edit = async (req, res) => {
    try {
        const userId = req.params.id;

        const User = await user.findById(userId);
        if (!User) {
            return res.status(404).send('User not found.');
        }

        res.render('edit-name', { title:"Edit-Name",User: User });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Error fetching user data.');
    }
};

const updatename = async (req, res) => {
    const { name, userId } = req.body;

    try {
        await user.findByIdAndUpdate(userId, { name });
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send('Error updating name.');
    }
};

const e404 = (req,res)=>{
    res.render('404');
}
module.exports = {
    index,
    product,
    details,
    signin,
    signup,
    otpp,
    signin_post,
    signup_post,
    logout,
    profile,
    verifyotp,
    resendotp,
    edit,
    updatename,
    initiatePasswordReset,
    resetPassword,
    rp,
    e404
}