const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Inserting Payment menu...');
    await prisma.adminMenu.create({
        data: {
            label: '결제 장부 관리',
            href: '/admin/payment',
            iconName: 'CreditCard',
            group: '결제', // User removed groups visually, but it still requires the field
            orderIndex: 0,
            isVisible: true
        }
    });
    console.log('Payment menu inserted.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
