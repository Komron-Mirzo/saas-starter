import { db } from '@/lib/db/drizzle';
import { storySlidersTable, storySliderGainsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import StorySliderSection from './StorySliderSection';
import type { StorySliderWithGains } from '@/lib/db/schema';

export default async function StorySliderSectionServer() {
  // Fetch all sliders
  const sliders = await db.select().from(storySlidersTable).orderBy(storySlidersTable.id);

  // Fetch all gains and attach them
  const gains = await db.select().from(storySliderGainsTable).orderBy(storySliderGainsTable.sortOrder);

  const slidesWithGains: StorySliderWithGains[] = sliders.map((slider) => ({
    ...slider,
    gains: gains.filter((g) => g.storySliderId === slider.id),
  }));

  return <StorySliderSection slides={slidesWithGains} />;
}