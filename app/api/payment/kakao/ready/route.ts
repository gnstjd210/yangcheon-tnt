import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { studentName, classMonth } = body;

        if (!studentName || !classMonth) {
            return NextResponse.json({ success: false, error: '이름과 수강월을 입력해주세요.' }, { status: 400 });
        }

        let SECRET_KEY = (process.env.KAKAO_PAY_SECRET_KEY || '').replace(/['"]/g, '').trim();
        SECRET_KEY = SECRET_KEY.replace(/^SECRET_KEY\s+/i, '');
        const CID = (process.env.KAKAO_PAY_CID || '').replace(/['"]/g, '').trim();

        const userId = studentName;
        // Accept dynamic amount, default to 100 if invalidly passed
        const amount = body.amount ? parseInt(body.amount, 10) : 100;

        // 1. Create Payment record in DB with pending status
        const payment = await prisma.payment.create({
            data: {
                studentName,
                classMonth,
                amount,
                status: 'pending',
                tid: '',
            }
        });

        // Derive base URL for callbacks
        const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        const approvalUrl = `${BASE_URL}/api/payment/kakao/success?paymentId=${payment.id}`;
        const cancelUrl = `${BASE_URL}/api/payment/kakao/cancel`;
        const failUrl = `${BASE_URL}/api/payment/kakao/fail`;

        // 2. Call KakaoPay Ready API
        const response = await fetch('https://open-api.kakaopay.com/online/v1/payment/ready', {
            method: 'POST',
            headers: {
                'Authorization': `SECRET_KEY ${SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cid: CID,
                partner_order_id: payment.id,
                partner_user_id: userId,
                item_name: `재수강 결제 (${classMonth})`,
                quantity: 1,
                total_amount: amount,
                vat_amount: 0,
                tax_free_amount: 0,
                approval_url: approvalUrl,
                cancel_url: cancelUrl,
                fail_url: failUrl,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('KakaoPay Ready API Error:', data);
            return NextResponse.json({ success: false, error: '카카오페이 결제 준비에 실패했습니다.', details: data }, { status: response.status });
        }

        // 3. Update DB with tid obtained from KakaoPay
        await prisma.payment.update({
            where: { id: payment.id },
            data: { tid: data.tid }
        });

        // 4. Return redirect URL to the client
        return NextResponse.json({
            success: true,
            redirectUrl: data.next_redirect_pc_url,
        });

    } catch (error) {
        console.error('Payment Ready Route Error:', error);
        return NextResponse.json({ success: false, error: '인터널 서버 오류' }, { status: 500 });
    }
}
