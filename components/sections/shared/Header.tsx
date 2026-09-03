'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Menu, X } from 'lucide-react';
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const navItems = [
  { label: "ABOUT", href: "#what-is" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "WORLDS", href: "#story-worlds" },
  { label: "PRICING", href: "#pricing" },
  { label: "STEFFI", href: "#about" },
  { label: "COMMUNITY", href: "#community" },
  { label: "FAQ", href: "#faq" },
  { label: "CONTACT", href: "#contact" },
];

function UserActions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild variant="default">
          <Link href="/sign-in">Log In</Link>
        </Button>
        <Button asChild variant="white">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="cursor-pointer size-10 shadow-sm border border-gray-200">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback className="bg-gray-100 text-gray-800 font-bold text-xs">
            {user.email ? user.email.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U'}
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-[#F3F3F3] relative">
      {/* Responsive grid: 2 columns on mobile/tablet, switching to 3 columns on desktop */}
      <div className="max-w-[1870px] mx-auto px-[20px] lg:px-[45px] py-[20px] grid grid-cols-[auto_1fr] min-[1201px]:grid-cols-[auto_1fr_auto] items-center gap-6">        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center shrink-0 max-md:w-[121px]">
          <img 
            src="/icons/logo-white.svg" 
            alt="Worthfit Logo" 
            className="h-[65px] w-auto object-contain" 
          />
        </Link>

        {/* Center: Fluid Responsive Desktop Navigation Pill */}
        <nav className="hidden min-[1201px]:flex justify-self-center items-center bg-white rounded-full px-6 py-3 shadow-sm justify-between w-full max-w-[1240px]">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{ marginRight: 'clamp(8px, 0.833vw, 16px)' }}
              className="text-caps-16-smbld !tracking-[-0.03em] cursor-pointer hover:text-[#FF7DA8] transition-colors uppercase whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions / Mobile Menu Toggle */}
        <div className="flex items-center justify-end shrink-0">
          <div className="hidden min-[1201px]:flex items-center">
            <Suspense fallback={<div className="h-10 w-24" />}>
              <UserActions />
            </Suspense>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="min-[1201px]:hidden flex items-center justify-center w-[65px] h-[65px] max-md:w-[50px] max-md:h-[50px] rounded-full bg-[#30D5C8] text-white shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Open Menu"
          >
            <Menu className="w-[40px] h-[40px] max-md:w-[30px] max-md:h-[30px] stroke-[2]" />
          </button>
        </div>

      </div>

      {/* Fullscreen Mobile & Tablet Navigation Overlay with Slide-Down Animation and Scroll Lock */}
     <div 
        className={`fixed inset-0 z-50 bg-[#F3F3F3] flex flex-col px-[20px] lg:px-[45px] py-[20px] overflow-hidden transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <img 
              src="/icons/logo-white.svg" 
              alt="Worthfit Logo" 
              className="h-[65px] w-auto object-contain max-md:w-[121px]" 
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center w-[65px] h-[65px] max-md:w-[50px] max-md:h-[50px] rounded-full bg-[#30D5C8] text-white shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Close Menu"
          >
            <X className="w-[40px] h-[40px] max-md:w-[30px] max-md:h-[30px] stroke-[2]" />
          </button>
        </div>

        <div className="bg-[#30D5C8] rounded-[50px] flex flex-col p-[25px] shadow-sm mb-6 flex-1 justify-around mx-auto w-full divide-y divide-white/50">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-h3-02 py-[20px] text-center text-white text-xs font-extrabold tracking-[-0.03em] uppercase hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="max-w-2xl mx-auto w-full pb-4 flex justify-center space-x-4">
          <Suspense fallback={null}>
            <Button asChild variant="default" className="w-[322px]">
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            </Button>
            <Button asChild variant="white" className="w-[322px]">
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </Button>
          </Suspense>
        </div>
      </div>
    </header>
  );
}