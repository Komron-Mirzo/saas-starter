'use server';

import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/db/queries';
import { getContentType, type FieldConfig } from '@/lib/cms/content-types';
import { put } from '@vercel/blob';
import { storySliderGainsTable } from '@/lib/db/schema';

// Simple admin check
function isAdmin(email: string | null | undefined): boolean {
  return email === 'supermiya1990@gmail.com' || email === 'connect@firstconnectapp.com';
}

async function verifyAdmin() {
  const user = await getUser();
  
  if (!user || !isAdmin(user.email)) {
    throw new Error('Unauthorized');
  }
}

async function extractValues(fields: FieldConfig[], formData: FormData) {
  const values: Record<string, any> = {};
  const repeaterValues: Record<string, any[]> = {};

  // Check for repeater fields encoded like fieldKey[index][subKey]
  for (const field of fields) {
    if (field.type === 'repeater') {
      const rows: Record<string, any>[] = [];
      let index = 0;

      while (true) {
        const firstSubKey = field.subFields?.[0]?.key;
        // Check if a row at this index exists in formData
        const checkKey = `${field.key}[${index}][${firstSubKey}]`;
        if (!formData.has(checkKey) && !formData.has(`${field.key}[${index}][iconUrl]`)) {
          break;
        }

        const rowData: Record<string, any> = {};
        if (field.subFields) {
          for (const sub of field.subFields) {
            const subFieldName = `${field.key}[${index}][${sub.key}]`;
            
            if (sub.type === 'image') {
              const file = formData.get(subFieldName) as File | null;
              if (file && file.size > 0) {
                const blob = await put(`cms/repeater-${sub.key}-${Date.now()}-${file.name}`, file, {
                  access: 'public',
                });
                rowData[sub.key] = blob.url;
              } else {
                const existing = formData.get(`${subFieldName}__existing`) as string | null;
                rowData[sub.key] = existing || '';
              }
            } else {
              rowData[sub.key] = (formData.get(subFieldName) as string) ?? '';
            }
          }
        }
        rows.push(rowData);
        index++;
      }
      repeaterValues[field.key] = rows;
    } else if (field.type === 'image') {
      const file = formData.get(field.key) as File | null;

      if (file && file.size > 0) {
        const blob = await put(`cms/${field.key}-${Date.now()}-${file.name}`, file, {
          access: 'public',
        });
        values[field.key] = blob.url;
      } else {
        const existing = formData.get(`${field.key}__existing`) as string | null;
        values[field.key] = existing || null;
      }
    } else {
      values[field.key] = (formData.get(field.key) as string) ?? '';
    }
  }

  // Fallback for background image if it's missing to satisfy not-null constraint
  if ('backgroundImageUrl' in values && !values.backgroundImageUrl) {
    values.backgroundImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
  }

  return { values, repeaterValues };
}

export async function createItem(type: string, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  const { values, repeaterValues } = await extractValues(config.fields, formData);
  
  const [newItem] = await db.insert(config.table as any).values(values).returning({ id: (config.table as any).id });

  // Handle repeater saving for story sliders
  if (type === 'storysliders' && newItem?.id && repeaterValues.gains) {
    for (const gain of repeaterValues.gains) {
      if (gain.text) {
        await db.insert(storySliderGainsTable).values({
          storySliderId: newItem.id,
          iconUrl: gain.iconUrl || '',
          text: gain.text,
        });
      }
    }
  }

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}

export async function updateItem(type: string, id: number, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  const { values, repeaterValues } = await extractValues(config.fields, formData);
  
  await db
    .update(config.table as any)
    .set({ ...values, updatedAt: new Date() })
    .where(eq((config.table as any).id, id));

  // Handle repeater updating for story sliders (replace old items)
  if (type === 'storysliders' && repeaterValues.gains) {
    await db.delete(storySliderGainsTable).where(eq(storySliderGainsTable.storySliderId, id));
    for (const gain of repeaterValues.gains) {
      if (gain.text) {
        await db.insert(storySliderGainsTable).values({
          storySliderId: id,
          iconUrl: gain.iconUrl || '',
          text: gain.text,
        });
      }
    }
  }

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}

export async function deleteItem(type: string, id: number) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  // Cascade delete child rows if storyslider
  if (type === 'storysliders') {
    await db.delete(storySliderGainsTable).where(eq(storySliderGainsTable.storySliderId, id));
  }

  await db.delete(config.table as any).where(eq((config.table as any).id, id));

  revalidatePath('/');
  revalidatePath(`/admin/content/${type}`);
}