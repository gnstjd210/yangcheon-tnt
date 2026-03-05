'use server';

import prisma from '@/lib/prisma';

export async function getAdminPayments(startDate?: string, endDate?: string) {
    try {
        const whereClause: Record<string, unknown> = {};

        if (startDate && endDate) {
            // Include full day timezone bounds
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            whereClause.createdAt = {
                gte: start,
                lte: end,
            };
        }

        const payments = await prisma.payment.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: payments };
    } catch (error) {
        console.error('Failed to fetch payments:', error);
        return { success: false, error: '결제 내역을 불러오는데 실패했습니다.' };
    }
}
