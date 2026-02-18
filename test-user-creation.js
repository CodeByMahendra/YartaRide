const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DB_CONNECT = 'mongodb://localhost:27017/YatraRide';

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
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
        enum: ['male', 'female', 'other'],
        required: true,
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
});

const User = mongoose.model('user', userSchema);

async function createTestUser() {
    try {
        await mongoose.connect(DB_CONNECT);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists');
            await mongoose.connection.close();
            return;
        }

        // Create test user
        const hashedPassword = await bcrypt.hash('123456', 10);
        const user = await User.create({
            fullname: {
                firstname: 'Test',
                lastname: 'User'
            },
            email: 'test@example.com',
            password: hashedPassword,
            gender: 'male',
            referralCode: 'TEST123'
        });

        console.log('Test user created successfully:', user.email);
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error creating test user:', error);
        await mongoose.connection.close();
    }
}

createTestUser();
