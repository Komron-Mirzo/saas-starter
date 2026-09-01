'use client';

import { useState, useMemo } from 'react';
import { createItem, updateItem } from '@/app/admin/content/actions';
import { DeleteButton } from './delete-button';
import type { FieldConfig } from '@/lib/cms/content-types';

interface Props {
  type: string;
  label: string;
  singular: string;
  fields: FieldConfig[];
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  items: Record<string, any>[];
}

const PAGE_SIZE = 8;

export function ContentTable({ type, label, singular, fields, titleField, subtitleField, imageField, items }: Props) {
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: Record<string, any> } | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [items, page]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
          <p className="text-sm text-gray-500">Manage your {label.toLowerCase()}</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition"
        >
          + Add New
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">{fields.find((f) => f.key === titleField)?.label ?? 'Title'}</th>
              {subtitleField && (
                <th className="px-4 py-3 font-medium hidden md:table-cell">
                  {fields.find((f) => f.key === subtitleField)?.label}
                </th>
              )}
              <th className="px-4 py-3 font-medium w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-gray-400">
                  No {label.toLowerCase()} yet. Click "Add New" to create one.
                </td>
              </tr>
            )}
            {pageItems.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                        {imageField && item[imageField] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item[imageField]} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        )}
                        <span className="font-medium text-gray-900 truncate">{item[titleField]}</span>
                        </div>
                    </td>
                    {subtitleField && (
                        <td className="px-4 py-3 text-gray-500 max-w-sm truncate hidden md:table-cell">
                        {item[subtitleField]}
                        </td>
                    )}
                    <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                        <button onClick={() => setModal({ mode: 'edit', item })} className="text-blue-600 text-xs hover:underline">
                            Edit
                        </button>
                        <DeleteButton type={type} id={item.id} label={singular} />
                        </div>
                    </td>
                    </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {items.length > PAGE_SIZE && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Page {page} of {totalPages} · {items.length} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ItemModal
          type={type}
          singular={singular}
          fields={fields}
          mode={modal.mode}
          item={modal.mode === 'edit' ? modal.item : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function ImageFieldInput({ fieldKey, existingUrl, namePrefix }: { fieldKey: string; existingUrl?: string; namePrefix?: string }) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const inputName = namePrefix ? `${namePrefix}[${fieldKey}]` : fieldKey;
  const existingName = namePrefix ? `${namePrefix}[${fieldKey}__existing]` : `${fieldKey}__existing`;

  return (
    <div className="space-y-2">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="w-16 h-16 object-cover rounded-md border" />
      )}
      <input
        type="file"
        name={inputName}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
        className="w-full mt-1 text-xs"
      />
      <input type="hidden" name={existingName} value={existingUrl ?? ''} />
    </div>
  );
}

function RepeaterFieldInput({ field, existingItems = [] }: { field: FieldConfig; existingItems?: Record<string, any>[] }) {
  const [rows, setRows] = useState<Record<string, any>[]>(
    existingItems.length > 0 ? existingItems : [{}]
  );

  const maxLimit = field.maxItems ?? 4;

  const addRow = () => {
    if (rows.length < maxLimit) {
      setRows([...rows, {}]);
    }
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{field.label}</label>
        <span className="text-xs text-gray-400">{rows.length} / {maxLimit} max</span>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-2 items-start bg-white p-3 border rounded-md shadow-sm relative">
            <div className="flex-1 space-y-2">
              {field.subFields?.map((sub) => {
                const subFieldName = `${field.key}[${index}][${sub.key}]`;
                if (sub.type === 'image') {
                  return (
                    <div key={sub.key}>
                      <span className="text-[10px] text-gray-400 block">{sub.label}</span>
                      <ImageFieldInput 
                        fieldKey={sub.key} 
                        existingUrl={row[sub.key]} 
                        namePrefix={`${field.key}[${index}]`} 
                      />
                    </div>
                  );
                }
                return (
                  <div key={sub.key}>
                    <span className="text-[10px] text-gray-400 block">{sub.label}</span>
                    <input
                      name={subFieldName}
                      defaultValue={row[sub.key] ?? ''}
                      placeholder={sub.label}
                      className="w-full p-1.5 border rounded text-xs"
                    />
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 mt-1"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {rows.length < maxLimit && (
        <button
          type="button"
          onClick={addRow}
          className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 border rounded text-xs font-semibold text-gray-700 transition"
        >
          + Add Item
        </button>
      )}
    </div>
  );
}

function ItemModal({
  type,
  singular,
  fields,
  mode,
  item,
  onClose,
}: {
  type: string;
  singular: string;
  fields: FieldConfig[];
  mode: 'add' | 'edit';
  item?: Record<string, any>;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? `Add ${singular}` : `Edit ${singular}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form
          action={async (formData) => {
            if (mode === 'add') {
              await createItem(type, formData);
            } else if (item) {
              await updateItem(type, item.id, formData);
            }
            onClose();
          }}
          className="space-y-4"
        >
          {fields.map((field) => {
            if (field.type === 'repeater') {
              return (
                <div key={field.key}>
                  <RepeaterFieldInput field={field} existingItems={item?.[field.key]} />
                </div>
              );
            }

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.key}
                    defaultValue={item?.[field.key] ?? ''}
                    required={field.required}
                    rows={4}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : field.type === 'image' ? (
                  <ImageFieldInput fieldKey={field.key} existingUrl={item?.[field.key]} />
                ) : (
                  <input
                    name={field.key}
                    defaultValue={item?.[field.key] ?? ''}
                    required={field.required}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800">
              {mode === 'add' ? 'Add' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}