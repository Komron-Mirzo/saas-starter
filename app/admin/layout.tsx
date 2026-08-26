import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { contentTypes } from '@/lib/cms/content-types';
import { signOut } from '@/app/(login)/actions';

const ADMIN_EMAILS = ['supermiya1990@gmail.com', 'connect@firstconnectapp.com'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  // Check if user is admin
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
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
        
        {/* User info and sign out */}
        <div className="p-3 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-3">
            Logged in as
            <br />
            <span className="text-gray-300">{user.email}</span>
          </div>
          
          {/* Sign Out Button using the same action as the template */}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Hello Admin{user.name ? `, ${user.name}` : ''} 👋
          </h1>
          
          {/* Mobile sign out button (optional) */}
          <form action={signOut} className="md:hidden">
            <button
              type="submit"
              className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 transition"
            >
              Sign Out
            </button>
          </form>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}