const API_URL = 'http://localhost:5000/api';

async function testHealth() {
    try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        console.log('Health Check:', data.ok ? 'PASS' : 'FAIL');
    } catch (err) {
        console.error('Health Check FAIL:', err.message);
    }
}

async function testValidation() {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'bad-email', password: '123' })
        });

        if (res.status === 400) {
            console.log('Validation Check: PASS (Got 400 as expected)');
        } else {
            console.log(`Validation Check: FAIL (Got ${res.status})`);
        }
    } catch (err) {
        console.log('Validation Check: FAIL', err.message);
    }
}

async function run() {
    await testHealth();
    await testValidation();
}

run();
