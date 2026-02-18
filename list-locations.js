const mongoose = require('mongoose');
require('dotenv').config();

const captainSchema = new mongoose.Schema({
    fullname: { firstname: String, lastname: String },
    status: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    }
});

const Captain = mongoose.models.captain || mongoose.model('captain', captainSchema);

async function listLocations() {
    await mongoose.connect(process.env.DB_CONNECT);
    const captains = await Captain.find({ status: 'active' });
    captains.forEach(c => {
        console.log(`${c.fullname.firstname}: ${c.location.coordinates}`);
    });
    process.exit(0);
}

listLocations();
