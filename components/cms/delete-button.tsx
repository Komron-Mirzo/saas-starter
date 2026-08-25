'use client';

import { useState, useTransition } from 'react';
import { deleteItem } from '@/app/admin/content/actions';

export function DeleteButton({ type, id, label }: { type: string; id: number; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        className="text-red-600 text-xs hover:underline"
      >
        Delete
      </button>

      {confirming && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => !isPending && setConfirming(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">Delete {label}?</h3>
              <p className="text-sm text-gray-500">
                This action can't be undone. This {label.toLowerCase()} will be permanently removed.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setConfirming(false)}
                className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await deleteItem(type, id);
                    setConfirming(false);
                  });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-40"
              >
                {isPending ? 'Deleting…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}