import { faqsTable, featuresTable, howsTable, reviewsTable, storySlidersTable } from '@/lib/db/schema';
import type { PgTable } from 'drizzle-orm/pg-core';

export type FieldType = 'text' | 'textarea' | 'image' | 'repeater';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxItems?: number;
  subFields?: FieldConfig[];
}

export interface ContentTypeConfig {
  slug: string;
  label: string;      // "FAQs"
  singular: string;   // "FAQ"
  table: PgTable;
  fields: FieldConfig[];
  titleField: string;      // which field to show as the row title
  subtitleField?: string;
  imageField?: string;  
}

export const contentTypes: Record<string, ContentTypeConfig> = {
  faqs: {
    slug: 'faqs',
    label: 'FAQs',
    singular: 'FAQ',
    table: faqsTable,
    titleField: 'question',
    subtitleField: 'answer',
    fields: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'answer', label: 'Answer', type: 'textarea', required: true },
    ],
  },
  reviews: {
    slug: 'reviews',
    label: 'Reviews',
    singular: 'Review',
    table: reviewsTable,
    titleField: 'authorName',
    subtitleField: 'quote',
    fields: [
      { key: 'authorName', label: 'Author Name', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text', required: true },
      { key: 'quote', label: 'Quote', type: 'textarea', required: true },
      { key: 'avatarUrl', label: 'Avatar Image', type: 'image' },
    ],
  },

  
  features: {
    slug: 'features',
    label: 'Features',
    singular: 'Feature',
    table: featuresTable,
    titleField: 'title',
    subtitleField: 'description',
    imageField: 'imageUrl',
    fields: [
      { key: 'title', label: 'Feature Title', type: 'text', required: true },
      { key: 'iconUrl', label: 'Thumbnail Icon (SVG)', type: 'image', required: true },
      { key: 'imageUrl', label: 'Featured Image', type: 'image', required: true },
      { key: 'description', label: 'Content Text', type: 'textarea', required: true },
    ],
  },

  hows: {
    slug: 'hows',
    label: 'How It Works',
    singular: 'How Step',
    table: howsTable,
    titleField: 'title',
    subtitleField: 'description',
    imageField: 'imageUrl',
    fields: [
      { key: 'numberText', label: 'Step Number (e.g. 01)', type: 'text', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'imageUrl', label: 'Featured Image', type: 'image', required: true },
      { key: 'description', label: 'Content Text', type: 'textarea', required: true },
    ],
  },

  storysliders: {
    slug: 'storysliders',
    label: 'Story Sliders',
    singular: 'Story Slider',
    table: storySlidersTable,
    titleField: 'title',
    subtitleField: 'categoryText',
    imageField: 'backgroundImageUrl',
    fields: [
      { key: 'categoryText', label: 'Category (e.g. Fantasy)', type: 'text', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'contentText', label: 'Content Text', type: 'textarea', required: true },
      { key: 'toneText', label: 'Tone Text', type: 'text', required: true },
      { key: 'goalText', label: 'Goal Text', type: 'textarea', required: true },
      { key: 'backgroundImageUrl', label: 'Background Image', type: 'image', required: true },
      { 
        key: 'gains', 
        label: "What You'll Gain Items", 
        type: 'repeater',
        maxItems: 4,
        subFields: [
          { key: 'iconUrl', label: 'Icon Image/SVG', type: 'image', required: true },
          { key: 'text', label: 'Benefit Text', type: 'text', required: true }
        ]
      },
    ],
  },
  
};

export function getContentType(slug: string) {
  return contentTypes[slug];
}