'use server';

import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/db/queries';
import { getContentType } from '@/lib/cms/content-types';

const ADMIN_EMAIL = 'supermiya1990@gmail.com';

async function verifyAdmin() {
  const user = await getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
}

function extractValues(fields: { key: string }[], formData: FormData) {
  const values: Record<string, string> = {};
  for (const field of fields) {
    values[field.key] = (formData.get(field.key) as string) ?? '';
  }
  return values;
}

export async function createItem(type: string, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  const values = extractValues(config.fields, formData);
  await db.insert(config.table as any).values(values);

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}

export async function updateItem(type: string, id: number, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  const values = extractValues(config.fields, formData);
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