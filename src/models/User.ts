import mongoose, { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        select: false,
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true,
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    socketId: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: String
    },
    freeRides: {
        type: Number,
        default: 0
    },
    firstRideCompleted: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, { expiresIn: '5d' });
    return token;
};

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password: string) {
    return await bcrypt.hash(password, 10);
};

const User = models.user || model('user', userSchema);

export default User;
