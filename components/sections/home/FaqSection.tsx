import { db } from '@/lib/db/drizzle';
import { faqsTable } from '@/lib/db/schema';
import FaqAccordion from './FaqAccordion';
import { Container } from '@/components/ui/container';

export default async function FaqSection() {
  const faqs = await db.select().from(faqsTable);

  return (
    <Container>
      <FaqAccordion faqs={faqs} />
    </Container>
  );
}