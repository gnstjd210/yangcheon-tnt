import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const urlObj = new URL(req.url);
    const BASE_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : `${urlObj.protocol}//${urlObj.host}`;
    return NextResponse.redirect(`${BASE_URL}/payment/fail?reason=error`);
}
