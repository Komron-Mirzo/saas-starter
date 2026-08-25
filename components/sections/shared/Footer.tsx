import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Footer() {
  const navColumn1 = [
    { label: "WHAT IS WORTHFIT?", href: "#" },
    { label: "HOW IT WORKS", href: "#" },
    { label: "STORY WORLDS", href: "#" },
    { label: "PLANS & PRICING", href: "#" },
    { label: "ABOUT STEFFI", href: "#" },
  ];

  const navColumn2 = [
    { label: "COMMUNITY", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "CONTACT", href: "#" },
  ];

  const socialLinks = [
    { icon: "/icons/instagram.svg", alt: "Instagram", href: "#" },
    { icon: "/icons/facebook.svg", alt: "Facebook", href: "#" },
    { icon: "/icons/tiktok.svg", alt: "TikTok", href: "#" },
    { icon: "/icons/youtube.svg", alt: "YouTube", href: "#" },
  ];

  const legalLinks = [
    { label: "TERMS AND CONDITIONS", href: "#" },
    { label: "PRIVACY POLICY", href: "#" },
    { label: "IMPRINT", href: "#" },
    { label: "COOKIE SETTINGS", href: "#" },
  ];

  return (
    <footer className="w-full bg-white pt-12 pb-8 border-t border-gray-100 text-gray-900">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
        
        {/* Top Section: Brand Banner & Steffi Character */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-4xl relative">
             <Image
                src="/images/footer-img.png"
                alt="Worthfit by Steffi"
                width={1200}
                height={400}
                className="w-full h-auto object-contain"
                priority
                unoptimized={true}
                />
          </div>
        </div>

        {/* Middle Content Grid: Responsive Layout matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start justify-between pt-4">
          
          {/* Navigation Column(s) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:contents">
            {/* Nav Group 1 */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Navigation</span>
              <ul className="flex flex-col space-y-2.5">
                {navColumn1.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-xs font-black tracking-wider hover:text-[#FF7DA8] transition-colors uppercase">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nav Group 2 */}
            <div className="flex flex-col space-y-3 lg:pt-6">
              <ul className="flex flex-col space-y-2.5">
                {navColumn2.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-xs font-black tracking-wider hover:text-[#FF7DA8] transition-colors uppercase">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacts & Socials Column */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Contacts</span>
              <p className="text-xs font-bold leading-relaxed tracking-wide text-gray-900 uppercase">
                LOREM IPSUM STR.64 81927 STUTTGART
              </p>
              <p className="text-xs font-bold tracking-wide text-gray-900 lowercase">
                WORTHFIT@GMAIL.COM
              </p>
              <p className="text-xs font-bold tracking-wide text-gray-900">
                089 37319547
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {socialLinks.map((social, idx) => (
                <Link 
                  key={idx} 
                  href={social.href} 
                  className="size-9 rounded-full bg-gray-500 flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Image src={social.icon} alt={social.alt} width={16} height={16} className="invert brightness-0" />
                </Link>
              ))}
            </div>

            {/* Reusable Global Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button asChild variant="default">
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4 text-center sm:text-left">
          <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
            © WORTHFIT BY STEFFI 2025. MADE WITH LOVE BY DIEIDEENSCHMIEDE.IO
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
            {legalLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="text-[10px] font-semibold tracking-wide text-gray-400 hover:text-gray-900 transition-colors uppercase">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}