import User from '@/models/User';
import Wallet from '@/models/Wallet';
import crypto from 'crypto';

export const createUser = async ({
    firstname, lastname, email, password, gender, referredBy
}: any) => {
    if (!firstname || !email || !password || !gender) {
        throw new Error('All fields are required');
    }
    const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const user = await User.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        gender,
        referralCode,
        referredBy
    });

    await Wallet.create({
        owner: user._id,
        ownerModel: 'user'
    });

    return user;
};
