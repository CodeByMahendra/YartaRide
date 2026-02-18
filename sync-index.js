const mongoose = require('mongoose');
require('dotenv').config();

const captainSchema = new mongoose.Schema({
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    }
});
captainSchema.index({ location: '2dsphere' });

const Captain = mongoose.models.captain || mongoose.model('captain', captainSchema);

async function syncIndex() {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('Syncing indexes...');
    await Captain.createIndexes();
    console.log('Indexes synced');
    process.exit(0);
}

syncIndex();
