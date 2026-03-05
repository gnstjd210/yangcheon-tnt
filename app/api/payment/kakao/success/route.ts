import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const pgToken = searchParams.get('pg_token');
        const paymentId = searchParams.get('paymentId');

        const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        if (!pgToken || !paymentId) {
            return NextResponse.redirect(`${BASE_URL}/payment/fail?reason=missing_params`);
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!payment || !payment.tid) {
            return NextResponse.redirect(`${BASE_URL}/payment/fail?reason=payment_not_found`);
        }

        let SECRET_KEY = (process.env.KAKAO_PAY_SECRET_KEY || '').replace(/['"]/g, '').trim();
        SECRET_KEY = SECRET_KEY.replace(/^SECRET_KEY\s+/i, '');
        const CID = (process.env.KAKAO_PAY_CID || '').replace(/['"]/g, '').trim();

        // 1. Approve Payment API
        const response = await fetch('https://open-api.kakaopay.com/online/v1/payment/approve', {
            method: 'POST',
            headers: {
                'Authorization': `SECRET_KEY ${SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cid: CID,
                tid: payment.tid,
                partner_order_id: payment.id,
                partner_user_id: payment.studentName,
                pg_token: pgToken,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('KakaoPay Approve API Error:', data);

            // Mark DB as failed
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed' }
            });

            return NextResponse.redirect(`${BASE_URL}/payment/fail?reason=approve_failed`);
        }

        // 2. Validation success - update DB
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'success' }
        });

        // 3. Redirect to frontend success page
        return NextResponse.redirect(`${BASE_URL}/payment/success`);

    } catch (error) {
        console.error('Payment Approval Error:', error);

        const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${BASE_URL}/payment/fail`);
    }
}
