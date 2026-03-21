import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pg_token } = body;

        if (!pg_token) {
            return NextResponse.json({ success: false, error: 'pg_token is missing' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const tid = cookieStore.get('kakao_tid')?.value;
        const partner_order_id = cookieStore.get('kakao_order_id')?.value;
        const partner_user_id = cookieStore.get('kakao_user_id')?.value;
        const paymentDbId = cookieStore.get('kakao_payment_db_id')?.value;

        if (!tid || !partner_order_id || !partner_user_id || !paymentDbId) {
            return NextResponse.json({ success: false, error: 'Payment session expired or invalid' }, { status: 400 });
        }

        let SECRET_KEY = (process.env.KAKAO_PAY_SECRET_KEY || '').replace(/['"]/g, '').trim();
        SECRET_KEY = SECRET_KEY.replace(/^SECRET_KEY\s+/i, '');
        const CID = (process.env.KAKAO_PAY_CLIENT_ID || '').replace(/['"]/g, '').trim();

        // 1. Approve Payment API
        const response = await fetch('https://open-api.kakaopay.com/online/v1/payment/approve', {
            method: 'POST',
            headers: {
                'Authorization': `SECRET_KEY ${SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cid: CID,
                tid: tid,
                partner_order_id: partner_order_id,
                partner_user_id: partner_user_id,
                pg_token: pg_token,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('KakaoPay Approve API Error:', data);
            
            // Mark DB as failed
            await prisma.payment.update({
                where: { id: paymentDbId },
                data: { status: 'failed' }
            });

            return NextResponse.json({ success: false, error: '결제 승인에 실패했습니다.', details: data }, { status: 400 });
        }

        // 2. Validation success - update DB
        await prisma.payment.update({
            where: { id: paymentDbId },
            data: { status: 'success' }
        });

        // 3. Clear cookies
        cookieStore.delete('kakao_tid');
        cookieStore.delete('kakao_order_id');
        cookieStore.delete('kakao_user_id');
        cookieStore.delete('kakao_payment_db_id');

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Payment Approval Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
