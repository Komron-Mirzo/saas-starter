import React from 'react';
import { db } from '@/lib/db/drizzle';
import { featuresTable } from '@/lib/db/schema';
import FeaturesClientCarousel from './FeaturesSliderSection'; // We will separate the client interactivity into this sub-component

export default async function FeaturesSectionCarousel() {
  // Fetch features dynamically from the database
  const dbFeatures = await db.select().from(featuresTable).orderBy(featuresTable.createdAt);

  // Map database fields to the structure expected by the cards
  const features = dbFeatures.map((feature, index) => ({
    id: feature.id,
    icon: feature.iconUrl || '✨', // Falls back to an emoji/icon if missing
    title: feature.title,
    description: feature.description ? [feature.description] : [], // Handles text area content
    imageUrl: feature.imageUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  }));

  // If no features are created yet, you can provide a safe fallback or leave it empty
  if (features.length === 0) {
    return null;
  }

  return <FeaturesClientCarousel features={features} />;
}