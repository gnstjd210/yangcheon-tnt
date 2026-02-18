import { getFAQs } from "@/app/actions/support";
import FAQList from "@/components/support/FAQList";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
    const faqs = await getFAQs();

    return (
        <FAQList initialFAQs={faqs} />
    );
}
