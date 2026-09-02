import { db } from '@/lib/db/drizzle';
import { storySlidersTable, storySliderGainsTable } from '@/lib/db/schema';
import StorySliderAnimatedSection from './StorySliderAnimatedSection';
import type { StorySliderWithGains } from '@/lib/db/schema';

export default async function StorySliderAnimatedSectionServer() {
  const sliders = await db
    .select()
    .from(storySlidersTable)
    .orderBy(storySlidersTable.id);

  const gains = await db
    .select()
    .from(storySliderGainsTable)
    .orderBy(storySliderGainsTable.sortOrder);

  const slidesWithGains: StorySliderWithGains[] = sliders.map((slider) => ({
    ...slider,
    gains: gains.filter((g) => g.storySliderId === slider.id),
  }));

  return <StorySliderAnimatedSection slides={slidesWithGains} />;
}