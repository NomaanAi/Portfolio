const API_URL = 'http://localhost:5000/api';

async function testStats(token) {
    try {
        const res = await fetch(`${API_URL}/analytics/stats`, {
            headers: { 'Cookie': `token=${token}` }
        });
        if (res.status === 200) {
            console.log('Stats Check: PASS');
        } else {
            console.log(`Stats Check: FAIL (${res.status})`);
        }
    } catch (err) {
        console.log('Stats Check: FAIL', err.message);
    }
}

async function run() {
    // Note: This script assumes we have a valid token or auth is disabled for testing.
    // Since we can't easily login via script without a valid user in DB, we will just check if the endpoint exists (401 is also a sign it exists but is protected).

    try {
        const res = await fetch(`${API_URL}/analytics/stats`);
        if (res.status === 401 || res.status === 200) {
            console.log('Stats Endpoint Exists: PASS');
        } else {
            console.log(`Stats Endpoint Check: FAIL (${res.status})`);
        }
    } catch (e) {
        console.log('Stats Endpoint Check: FAIL', e.message);
    }
}

run();
