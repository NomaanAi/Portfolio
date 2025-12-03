const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const ADMIN = { email: 'admin@example.com', password: 'admin123' };

async function run() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, ADMIN);
        const cookie = loginRes.headers['set-cookie'];
        console.log('   Success! Got cookie.');

        const headers = { Cookie: cookie };

        console.log('\n2. Creating Test Project...');
        const createRes = await axios.post(`${API_URL}/projects`, {
            title: 'CRUD Test Project',
            desc: 'Testing update and delete',
            tags: ['Test']
        }, { headers });
        const projectId = createRes.data._id;
        console.log(`   Success! Created Project ID: ${projectId}`);

        console.log('\n3. Updating Project...');
        const updateRes = await axios.put(`${API_URL}/projects/${projectId}`, {
            title: 'UPDATED Title'
        }, { headers });
        console.log(`   Success! New Title: ${updateRes.data.title}`);

        console.log('\n4. Deleting Project...');
        await axios.delete(`${API_URL}/projects/${projectId}`, { headers });
        console.log('   Success! Project Deleted.');

        console.log('\n✅ CRUD Verification PASSED');

    } catch (error) {
        console.error('\n❌ FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

run();
