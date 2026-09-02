'use server';

import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/db/queries';
import { getContentType, type FieldConfig } from '@/lib/cms/content-types';
import { put, del } from '@vercel/blob';
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

// Helper to extract filename from URL for deletion
function extractBlobPathname(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return null;
  }
}

// Helper to delete old image from blob storage
async function deleteOldImage(oldUrl: string | null | undefined) {
  if (!oldUrl) return;
  
  try {
    if (oldUrl.includes('vercel-blob') || oldUrl.includes('blob.vercel-storage.com')) {
      const pathname = extractBlobPathname(oldUrl);
      if (pathname) {
        await del(pathname);
        console.log(`Deleted old image: ${pathname}`);
      }
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
}

async function extractValues(fields: FieldConfig[], formData: FormData, currentItem?: Record<string, any>) {
  const values: Record<string, any> = {};
  const repeaterValues: Record<string, any[]> = {};
  const imagesToDelete: string[] = [];

  console.log('=== EXTRACT VALUES START ===');
  
  // Log all form data entries for debugging
  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, type: ${value.type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }

  for (const field of fields) {
    console.log(`Processing field: ${field.key} (${field.type})`);
    
    if (field.type === 'repeater') {
      const rows: Record<string, any>[] = [];
      let index = 0;

      while (true) {
        const hasAnySubField = field.subFields?.some(
          (sub) =>
            formData.has(`${field.key}[${index}][${sub.key}]`) ||
            formData.has(`${field.key}[${index}][${sub.key}]__existing`) ||
            formData.has(`${field.key}[${index}][${sub.key}]__remove`)
        );
        if (!hasAnySubField) break;

        const rowData: Record<string, any> = {};
        let hasContent = false;
        
        if (field.subFields) {
          for (const sub of field.subFields) {
            const subFieldName = `${field.key}[${index}][${sub.key}]`;

            if (sub.type === 'image') {
              const file = formData.get(subFieldName) as File | null;
              const existing = formData.get(`${subFieldName}__existing`) as string | null;
              const removeFlag = formData.get(`${subFieldName}__remove`) as string | null;

              if (removeFlag === 'true') {
                const currentImage = existing || currentItem?.[field.key]?.[index]?.[sub.key] || 
                                   currentItem?.[field.key]?.[index]?.[sub.key.replace(/([A-Z])/g, '_$1').toLowerCase()];
                if (currentImage && currentImage !== '') {
                  imagesToDelete.push(currentImage);
                }
                rowData[sub.key] = '';
              } else if (file && file.size > 0) {
                try {
                  console.log(`  Uploading repeater image: ${file.name} (${file.size} bytes)`);
                  
                  if (existing && existing !== '') {
                    imagesToDelete.push(existing);
                  }
                  
                  const blob = await put(
                    `cms/repeater-${sub.key}-${Date.now()}-${file.name}`,
                    file,
                    { access: 'public' }
                  );
                  rowData[sub.key] = blob.url;
                  if (blob.url) hasContent = true;
                  console.log(`  Uploaded: ${blob.url}`);
                } catch (error) {
                  console.error('Error uploading repeater image:', error);
                  // If upload fails, keep existing if available
                  if (existing) {
                    rowData[sub.key] = existing;
                    if (existing) hasContent = true;
                  }
                }
              } else if (existing && existing !== '') {
                rowData[sub.key] = existing;
                hasContent = true;
              }
            } else {
              const value = formData.get(subFieldName) as string;
              rowData[sub.key] = value ?? '';
              if (value && value.trim()) hasContent = true;
            }
          }
        }
        
        if (hasContent) {
          rows.push(rowData);
        }
        index++;
      }
      repeaterValues[field.key] = rows;
      console.log(`  Repeater rows: ${rows.length}`);
    } else if (field.type === 'image') {
      const file = formData.get(field.key) as File | null;
      const existing = formData.get(`${field.key}__existing`) as string | null;
      const removeFlag = formData.get(`${field.key}__remove`) as string | null;

      console.log(`  Image: file=${file?.name || 'none'}, existing=${existing}, remove=${removeFlag}`);

      if (removeFlag === 'true') {
        const currentImage = currentItem?.[field.key] || 
                           currentItem?.[field.key.replace(/([A-Z])/g, '_$1').toLowerCase()];
        if (currentImage && currentImage !== '') {
          imagesToDelete.push(currentImage);
        }
        values[field.key] = '';
        console.log(`  Image removed`);
      } else if (file && file.size > 0) {
        try {
          console.log(`  Uploading image: ${file.name} (${file.size} bytes, type: ${file.type})`);
          
          const currentImage = currentItem?.[field.key] || 
                             currentItem?.[field.key.replace(/([A-Z])/g, '_$1').toLowerCase()];
          if (currentImage && currentImage !== '' && currentImage !== existing) {
            imagesToDelete.push(currentImage);
          }
          
          // Sanitize filename to avoid issues
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const blob = await put(`cms/${field.key}-${Date.now()}-${sanitizedName}`, file, {
            access: 'public',
          });
          values[field.key] = blob.url;
          console.log(`  Uploaded: ${blob.url}`);
        } catch (error) {
          console.error(`Error uploading image for ${field.key}:`, error);
          // If upload fails, try to keep existing
          if (existing) {
            values[field.key] = existing;
          } else if (currentItem?.[field.key]) {
            values[field.key] = currentItem[field.key];
          }
        }
      } else if (existing && existing !== '') {
        values[field.key] = existing;
        console.log(`  Keeping existing: ${existing}`);
      } else if (currentItem?.[field.key]) {
        values[field.key] = currentItem[field.key];
        console.log(`  Keeping current: ${currentItem[field.key]}`);
      }
    } else {
      // For text, textarea, etc.
      const value = formData.get(field.key) as string;
      values[field.key] = value ?? '';
      console.log(`  Text field: ${field.key} = "${values[field.key]}"`);
    }
  }

  console.log('Final values:', values);
  console.log('Images to delete:', imagesToDelete);
  console.log('=== EXTRACT VALUES END ===');
  
  return { values, repeaterValues, imagesToDelete };
}

export async function createItem(type: string, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  try {
    console.log(`=== CREATE ITEM: ${type} ===`);
    const { values, repeaterValues } = await extractValues(config.fields, formData);

    const createValues: Record<string, any> = {};
    for (const field of config.fields) {
      if (field.type !== 'repeater') {
        if (field.type === 'image' && (values[field.key] === undefined || values[field.key] === null)) {
          createValues[field.key] = '';
        } else if (values[field.key] !== undefined && values[field.key] !== null) {
          createValues[field.key] = values[field.key];
        } else if (field.required) {
          createValues[field.key] = '';
        }
      }
    }

    // Handle snake_case for all content types
    for (const field of config.fields) {
      if (field.type === 'image') {
        const snakeKey = field.key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (createValues[field.key] !== undefined) {
          createValues[snakeKey] = createValues[field.key];
        }
      }
    }

    console.log('Create values:', createValues);

    const [newItem] = await db
      .insert(config.table as any)
      .values(createValues)
      .returning({ id: (config.table as any).id });

    // Handle repeater saving for story sliders
    if (type === 'storysliders' && newItem?.id && repeaterValues.gains) {
      console.log(`Saving ${repeaterValues.gains.length} gains`);
      for (const gain of repeaterValues.gains) {
        if (gain.iconUrl || gain.text) {
          await db.insert(storySliderGainsTable).values({
            storySliderId: newItem.id,
            iconUrl: gain.iconUrl ?? '',
            text: gain.text ?? '',
          });
        }
      }
    }

    revalidatePath('/');
    revalidatePath(`/admin/content/${type}`);
    return { success: true };
  } catch (error) {
    console.error('Create error:', error);
    throw new Error(`Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateItem(type: string, id: number, formData: FormData) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  try {
    console.log(`=== UPDATE ITEM: ${type} (ID: ${id}) ===`);
    
    const [currentItem] = await db
      .select()
      .from(config.table as any)
      .where(eq((config.table as any).id, id));

    if (!currentItem) throw new Error('Item not found');
    console.log('Current item:', currentItem);

    const { values, repeaterValues, imagesToDelete } = await extractValues(config.fields, formData, currentItem);

    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };
    
    for (const field of config.fields) {
      if (field.type === 'repeater') {
        continue;
      }
      
      // Start with current value from database
      if (currentItem[field.key] !== undefined && currentItem[field.key] !== null) {
        updateData[field.key] = currentItem[field.key];
      } else if (field.type === 'image') {
        updateData[field.key] = '';
      } else {
        updateData[field.key] = '';
      }
      
      // Override with form value if provided
      if (values[field.key] !== undefined && values[field.key] !== null) {
        updateData[field.key] = values[field.key];
      }
    }

    // Handle snake_case for all content types
    for (const field of config.fields) {
      if (field.type === 'image') {
        const snakeKey = field.key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (updateData[field.key] !== undefined) {
          updateData[snakeKey] = updateData[field.key];
        }
      }
    }

    console.log('Update data:', updateData);
    console.log('Images to delete:', imagesToDelete);

    // Delete old images from blob storage
    for (const imageUrl of imagesToDelete) {
      await deleteOldImage(imageUrl);
    }

    await db
      .update(config.table as any)
      .set(updateData)
      .where(eq((config.table as any).id, id));

    // Handle repeater updating for story sliders
    if (type === 'storysliders') {
      if (repeaterValues.gains !== undefined) {
        console.log(`Updating ${repeaterValues.gains.length} gains`);
        
        const existingGains = await db
          .select()
          .from(storySliderGainsTable)
          .where(eq(storySliderGainsTable.storySliderId, id));
        
        for (const gain of existingGains) {
          if (gain.iconUrl && gain.iconUrl !== '') {
            const stillExists = repeaterValues.gains.some(g => g.iconUrl === gain.iconUrl);
            if (!stillExists) {
              await deleteOldImage(gain.iconUrl);
            }
          }
        }
        
        await db
          .delete(storySliderGainsTable)
          .where(eq(storySliderGainsTable.storySliderId, id));

        for (const gain of repeaterValues.gains) {
          if (gain.iconUrl || gain.text) {
            await db.insert(storySliderGainsTable).values({
              storySliderId: id,
              iconUrl: gain.iconUrl ?? '',
              text: gain.text ?? '',
            });
          }
        }
      }
    }

    revalidatePath('/');
    revalidatePath(`/admin/content/${type}`);
    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    throw new Error(`Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteItem(type: string, id: number) {
  await verifyAdmin();
  const config = getContentType(type);
  if (!config) throw new Error(`Unknown content type: ${type}`);

  try {
    const [item] = await db
      .select()
      .from(config.table as any)
      .where(eq((config.table as any).id, id));

    if (item) {
      for (const field of config.fields) {
        if (field.type === 'image') {
          const imageUrl = item[field.key] || item[field.key.replace(/([A-Z])/g, '_$1').toLowerCase()];
          if (imageUrl && imageUrl !== '') {
            await deleteOldImage(imageUrl);
          }
        }
      }
    }

    if (type === 'storysliders') {
      const gains = await db
        .select()
        .from(storySliderGainsTable)
        .where(eq(storySliderGainsTable.storySliderId, id));
      
      for (const gain of gains) {
        if (gain.iconUrl && gain.iconUrl !== '') {
          await deleteOldImage(gain.iconUrl);
        }
      }
      
      await db
        .delete(storySliderGainsTable)
        .where(eq(storySliderGainsTable.storySliderId, id));
    }

    await db.delete(config.table as any).where(eq((config.table as any).id, id));

    revalidatePath('/');
    revalidatePath(`/admin/content/${type}`);
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}