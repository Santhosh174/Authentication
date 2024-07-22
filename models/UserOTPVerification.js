const mongoose = require('mongoose');

const otp_schema = new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
});

const UserOTPVerification = mongoose.model("UserOTPVerification",otp_schema);
module.exports = UserOTPVerification;
