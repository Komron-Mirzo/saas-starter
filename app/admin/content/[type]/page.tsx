import { db } from '@/lib/db/drizzle';
import { getContentType, contentTypes } from '@/lib/cms/content-types';
import { notFound } from 'next/navigation';
import { ContentTable } from '@/components/cms/content-table';

export function generateStaticParams() {
  return Object.keys(contentTypes).map((slug) => ({ type: slug }));
}

export default async function ContentTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getContentType(type);
  if (!config) notFound();

  const items = await db.select().from(config.table as any);

  return (
    <ContentTable
      type={type}
      label={config.label}
      singular={config.singular}
      fields={config.fields}
      titleField={config.titleField}
      subtitleField={config.subtitleField}
      items={items}
    />
  );
}