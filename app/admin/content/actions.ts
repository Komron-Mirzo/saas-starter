'use server';

import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/db/queries';
import { getContentType, type FieldConfig } from '@/lib/cms/content-types';
import { put } from '@vercel/blob';

const ADMIN_EMAIL = 'supermiya1990@gmail.com';

async function verifyAdmin() {
  const user = await getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
}

async function extractValues(fields: FieldConfig[], formData: FormData) {
  const values: Record<string, any> = {};

  for (const field of fields) {
    if (field.type === 'image') {
      const file = formData.get(field.key) as File | null;

      if (file && file.size > 0) {
        // New file chosen — upload to Vercel Blob
        const blob = await put(`cms/${field.key}-${Date.now()}-${file.name}`, file, {
          access: 'public',
        });
        values[field.key] = blob.url;
      } else {
        // No new file — keep whatever URL was already there (edit mode)
        const existing = formData.get(`${field.key}__existing`) as string | null;
        values[field.key] = existing || null;
      }
    } else {
      values[field.key] = (formData.get(field.key) as string) ?? '';
    }
  }

  return values;
}

export async function createItem(type: string, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  const values = await extractValues(config.fields, formData);
  await db.insert(config.table as any).values(values);

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}

export async function updateItem(type: string, id: number, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  const values = await extractValues(config.fields, formData);
  await db
    .update(config.table as any)
    .set({ ...values, updatedAt: new Date() })
    .where(eq((config.table as any).id, id));

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}

export async function deleteItem(type: string, id: number) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  await db.delete(config.table as any).where(eq((config.table as any).id, id));

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}