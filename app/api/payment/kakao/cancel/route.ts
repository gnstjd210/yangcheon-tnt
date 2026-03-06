import { NextResponse } from 'next/server';

export async function GET() {
    console.log('KakaoPay payment cancelled by user');

    // Redirect the user back to the payment page with a cancel query param
    return NextResponse.redirect(new URL('/payment?status=cancelled', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
