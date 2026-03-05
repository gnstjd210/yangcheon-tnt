import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${BASE_URL}/payment/fail?reason=error`);
}
