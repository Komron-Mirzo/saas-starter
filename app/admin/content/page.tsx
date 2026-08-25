import { db } from '@/lib/db/drizzle';
import { contentTypes } from '@/lib/cms/content-types';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const counts = await Promise.all(
    Object.values(contentTypes).map(async (ct) => {
      const rows = await db.select().from(ct.table as any);
      return { ...ct, count: rows.length };
    })
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Overview of your site content.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {counts.map((ct) => (
          <Link
            key={ct.slug}
            href={`/admin/content/${ct.slug}`}
            className="p-5 bg-white border rounded-xl hover:border-gray-400 hover:shadow-sm transition"
          >
            <p className="text-2xl font-bold text-gray-900">{ct.count}</p>
            <p className="text-sm text-gray-500 mt-1">{ct.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}