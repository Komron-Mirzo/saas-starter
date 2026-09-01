import { db } from '@/lib/db/drizzle';
import { getContentType, contentTypes } from '@/lib/cms/content-types';
import { notFound } from 'next/navigation';
import { ContentTable } from '@/components/cms/content-table';
import { storySliderGainsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export function generateStaticParams() {
  return Object.keys(contentTypes).map((slug) => ({ type: slug }));
}

export default async function ContentTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getContentType(type);
  if (!config) notFound();

  // Fetch base items
  const baseItems = await db.select().from(config.table as any);

  // If it's storysliders, fetch and attach the child repeater rows (gains)
  let items = baseItems;
  if (type === 'storysliders') {
    items = await Promise.all(
      baseItems.map(async (slider: any) => {
        const gains = await db
          .select()
          .from(storySliderGainsTable)
          .where(eq(storySliderGainsTable.storySliderId, slider.id));
        return { ...slider, gains };
      })
    );
  }

  return (
    <ContentTable
      type={type}
      label={config.label}
      singular={config.singular}
      fields={config.fields}
      titleField={config.titleField}
      subtitleField={config.subtitleField}
      imageField={config.imageField}
      items={items}
    />
  );
}