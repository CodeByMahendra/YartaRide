const mongoose = require('mongoose');
require('dotenv').config();

const captainSchema = new mongoose.Schema({
    fullname: { firstname: String, lastname: String },
    status: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    vehicle: {
        vehicleType: { type: String, default: 'moto' }
    }
});

const Captain = mongoose.models.captain || mongoose.model('captain', captainSchema);

async function forceUpdate() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to DB');

        const captains = await Captain.find({});
        for (let c of captains) {
            c.status = 'active';
            // Set near Indore
            c.location = {
                type: 'Point',
                coordinates: [75.8577 + (Math.random() - 0.5) * 0.05, 22.7196 + (Math.random() - 0.5) * 0.05]
            };
            if (!c.vehicle) c.vehicle = {};
            if (!c.vehicle.vehicleType) c.vehicle.vehicleType = 'moto';

            await c.save();
            console.log(`Updated ${c.fullname.firstname} to ${c.location.coordinates}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

forceUpdate();
