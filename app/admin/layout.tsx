import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { contentTypes } from '@/lib/cms/content-types';

const ADMIN_EMAIL = 'supermiya1990@gmail.com';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/sign-in?redirect=/admin/content');
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-900 text-gray-300 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <span className="text-white font-bold text-lg">CMS</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link href="/admin/content" className="block px-3 py-2 rounded-md text-sm hover:bg-gray-800 hover:text-white transition">
            Dashboard
          </Link>
          <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wide text-gray-500">Content</p>
          {Object.values(contentTypes).map((ct) => (
            <Link
              key={ct.slug}
              href={`/admin/content/${ct.slug}`}
              className="block px-3 py-2 rounded-md text-sm hover:bg-gray-800 hover:text-white transition"
            >
              {ct.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 text-xs text-gray-500">
          Logged in as
          <br />
          <span className="text-gray-300">{user.email}</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Hello Admin{user.name ? `, ${user.name}` : ''} 👋
          </h1>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}