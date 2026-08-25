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
  items: Record<string, any>[];
}

const PAGE_SIZE = 8;

export function ContentTable({ type, label, singular, fields, titleField, subtitleField, items }: Props) {
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
                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{item[titleField]}</td>
                {subtitleField && (
                  <td className="px-4 py-3 text-gray-500 max-w-sm truncate hidden md:table-cell">
                    {item[subtitleField]}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setModal({ mode: 'edit', item })}
                      className="text-blue-600 text-xs hover:underline"
                    >
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4"
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
          {fields.map((field) => (
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
              ) : (
                <input
                  name={field.key}
                  defaultValue={item?.[field.key] ?? ''}
                  required={field.required}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              )}
            </div>
          ))}

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