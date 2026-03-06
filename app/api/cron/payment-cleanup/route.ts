import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Only allow Vercel Cron invocation by checking the secret header
    // (In local development, you might want to bypass this for testing)
    const authHeader = request.headers.get('authorization');
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find and delete payments where deletedAt is older than 7 days
        const { count } = await prisma.payment.deleteMany({
            where: {
                deletedAt: {
                    lte: sevenDaysAgo
                }
            }
        });

        console.log(`[Cron] Permanently deleted ${count} payment records older than 7 days.`);

        return NextResponse.json({
            success: true,
            message: `Deleted ${count} old payment records.`,
            deletedCount: count
        });
    } catch (error) {
        console.error('[Cron] Failed to cleanup payment records:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
