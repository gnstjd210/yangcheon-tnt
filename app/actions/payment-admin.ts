'use server';

import prisma from '@/lib/prisma';

export async function getAdminPayments(startDate?: string, endDate?: string) {
    try {
        const whereClause: Record<string, unknown> = {
            deletedAt: null // Only fetch active records
        };

        if (startDate && endDate) {
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

export async function updatePayment(id: string, data: { studentName: string; classMonth: string }) {
    try {
        await prisma.payment.update({
            where: { id },
            data: {
                studentName: data.studentName,
                classMonth: data.classMonth,
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to update payment:', error);
        return { success: false, error: '수정에 실패했습니다.' };
    }
}

export async function softDeletePayment(id: string) {
    try {
        await prisma.payment.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to delete payment:', error);
        return { success: false, error: '삭제에 실패했습니다.' };
    }
}

export async function getDeletedPayments() {
    try {
        const payments = await prisma.payment.findMany({
            where: {
                deletedAt: { not: null }
            },
            orderBy: {
                deletedAt: 'desc',
            },
        });

        return { success: true, data: payments };
    } catch (error) {
        console.error('Failed to fetch deleted payments:', error);
        return { success: false, error: '삭제된 내역을 불러오는데 실패했습니다.' };
    }
}

export async function restorePayment(id: string) {
    try {
        await prisma.payment.update({
            where: { id },
            data: { deletedAt: null }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to restore payment:', error);
        return { success: false, error: '복구에 실패했습니다.' };
    }
}
