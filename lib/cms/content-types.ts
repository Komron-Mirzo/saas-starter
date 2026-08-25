import { faqsTable, reviewsTable } from '@/lib/db/schema';
import type { PgTable } from 'drizzle-orm/pg-core';

export type FieldType = 'text' | 'textarea' | 'image';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
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

  // 👇 To add a new post type in future, just add an entry here.
  // No new files, no new components. Example:
  //
  // posts: {
  //   slug: 'posts',
  //   label: 'Blog Posts',
  //   singular: 'Post',
  //   table: postsTable, // define this in schema.ts first
  //   titleField: 'title',
  //   subtitleField: 'excerpt',
  //   fields: [
  //     { key: 'title', label: 'Title', type: 'text', required: true },
  //     { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  //     { key: 'body', label: 'Body', type: 'textarea', required: true },
  //   ],
  // },
};

export function getContentType(slug: string) {
  return contentTypes[slug];
}