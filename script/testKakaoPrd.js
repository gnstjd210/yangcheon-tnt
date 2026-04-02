const fs = require('fs');
const path = require('path');

async function testKakaoPay() {
    const envString = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
    const env = {};
    envString.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)="?(.*)"?/);
        if (match) {
            env[match[1]] = match[2];
        }
    });

    const SECRET_KEY = env.KAKAO_PAY_SECRET_KEY;
    const CID = env.KAKAO_PAY_CID;

    console.log('Testing with CID:', CID);
    console.log('Secret Key (prefix):', SECRET_KEY ? SECRET_KEY.substring(0, 10) + '...' : 'MISSING');

    try {
        const response = await fetch('https://open-api.kakaopay.com/online/v1/payment/ready', {
            method: 'POST',
            headers: {
                'Authorization': `SECRET_KEY ${SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cid: CID,
                partner_order_id: 'test_order',
                partner_user_id: 'test_user',
                item_name: `재수강 결제 테스트`,
                quantity: 1,
                total_amount: 100,
                vat_amount: 0,
                tax_free_amount: 0,
                approval_url: 'https://tntsa.co.kr/payment/success',
                cancel_url: 'https://tntsa.co.kr/payment/cancel',
                fail_url: 'https://tntsa.co.kr/payment/fail',
            }),
        });

        const data = await response.json();
        console.log('HTTP Status:', response.status);
        console.log('Response:', data);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testKakaoPay();
