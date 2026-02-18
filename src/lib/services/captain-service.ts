import Captain from '@/models/Captain';
import Wallet from '@/models/Wallet';
import crypto from 'crypto';

export const createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, ltd, lng, gender, referredBy
}: any) => {
    if (!firstname || !email || !password || !color || !plate || !vehicleType) {
        throw new Error('Required fields missing for captain creation');
    }
    const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const captain = await Captain.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
        location: {
            type: 'Point',
            coordinates: [lng || 0, ltd || 0]
        },
        gender,
        referralCode,
        referredBy
    });

    await Wallet.create({
        owner: captain._id,
        ownerModel: 'captain'
    });

    return captain;
};
