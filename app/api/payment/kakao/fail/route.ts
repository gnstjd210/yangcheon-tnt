import { NextResponse } from 'next/server';

export async function GET() {
    console.error('KakaoPay payment failed by user or system');

    // Redirect the user back to the payment page with a failure query param
    // You can customize this redirect URL to where you want the user to end up
    return NextResponse.redirect(new URL('/payment/fail?reason=failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
