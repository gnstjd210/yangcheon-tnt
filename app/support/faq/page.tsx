import prisma from "@/lib/prisma";
import FAQList from "@/components/support/FAQList";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <FAQList initialFAQs={faqs} />
    );
}
