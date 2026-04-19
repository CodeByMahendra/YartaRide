import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    otp: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'captain'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires in 5 minutes
    },
});

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

export default Otp;
