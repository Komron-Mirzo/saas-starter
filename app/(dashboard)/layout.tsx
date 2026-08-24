'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { Footer } from '@/components/ui/Footer';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserActions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  // If user is NOT logged in, show separate Log In & Sign Up buttons matching Figma
  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button 
          asChild 
          className="rounded-full text-xs font-bold uppercase px-6 py-5 bg-[#FF7DA8] hover:bg-[#ff6598] text-white shadow-sm"
        >
          <Link href="/sign-in">Log In</Link>
        </Button>
        <Button 
          asChild 
          variant="outline"
          className="rounded-full text-xs font-bold uppercase px-6 py-5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  // If user IS logged in, show their avatar dropdown menu
  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="cursor-pointer size-10 shadow-sm border border-gray-200">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback className="bg-gray-100 text-gray-800 font-bold text-xs">
            {user.email
              ? user.email.split(' ').map((n) => n[0]).join('').toUpperCase()
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1 w-48 p-2">
        <DropdownMenuItem className="cursor-pointer rounded-md">
          <Link href="/dashboard" className="flex w-full items-center font-medium text-xs">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer rounded-md text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-medium text-xs">Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const navItems = [
    "WHAT IS WORTHFIT?",
    "HOW IT WORKS",
    "STORY WORLDS",
    "PLANS & PRICING",
    "ABOUT STEFFI",
    "COMMUNITY",
    "FAQ",
    "CONTACT",
  ];

  return (
    <header className="border-b border-border bg-[#F3F3F3]">
      <div className="max-w-[1870px] mx-auto px-8 py-4 flex justify-between items-center gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img 
            src="/icons/logo-white.svg" 
            alt="Worthfit Logo" 
            className="h-[65px] w-auto object-contain" 
          />
        </Link>

        {/* Central White Pill Navigation Container */}
        <nav className="hidden xl:flex items-center bg-white rounded-full px-8 py-3 shadow-sm space-x-7 flex-1 max-w-fit justify-center">
          {navItems.map((item, index) => (
            <span
              key={index}
              className="text-xs font-extrabold tracking-wider text-gray-900 cursor-pointer hover:text-[#FF7DA8] transition-colors uppercase whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Right Side: Log In / Sign Up or User Avatar */}
        <div className="flex items-center shrink-0">
          <Suspense fallback={<div className="h-10 w-24" />}>
            <UserActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen bg-[#F3F3F3]">
      <Header />
      {children}
      <Footer />
    </section>
  );
}