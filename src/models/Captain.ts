import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const captainSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            minlength: [3, 'Firstname must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Lastname must be at least 3 characters long'],
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
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    vehicle: {
        color: {
            type: String,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            enum: ['car', 'moto', 'auto'],
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
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
    }
}, { timestamps: true });

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, { expiresIn: '5d' });
    return token;
};

captainSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password: string) {
    return await bcrypt.hash(password, 10);
};

captainSchema.index({ location: '2dsphere' });

const Captain = models.captain || model('captain', captainSchema);

export default Captain;
