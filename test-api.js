const axios = require('axios');
require('dotenv').config();

async function testApi() {
    const baseUrl = 'http://localhost:3000';
    try {
        // Need a token to test, but I can bypass or use a mock if I create a test route.
        // Let's just try to call it and see if it returns 401 or something else.
        const res = await axios.get(`${baseUrl}/api/captain/near?ltd=22.7196&lng=75.8577&radius=10`);
        console.log('Status:', res.status);
        console.log('Body:', res.data);
    } catch (err) {
        console.log('Error status:', err.response?.status);
        console.log('Error data:', err.response?.data);
    }
}

testApi();
