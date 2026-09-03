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
    <footer className="w-full pt-[200px] max-lg:pt-[100px] pb-[30px] text-gray-900">
<div className="max-w-[1650px] mx-auto px-[20px] lg:px-[45px] flex flex-col gap-12">
        {/* Top Section: Brand Banner & Steffi Character */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-4xl relative">
            <Image
              src="/images/footer-img.png"
              alt="Worthfit by Steffi"
              width={1230}
              height={483}
              className="w-full h-auto object-contain"
              priority
              unoptimized={true}
            />
          </div>
        </div>

        {/* Middle Content: stacked below lg, 4-col grid (nav1=1, nav2=1, contacts=2) at lg+ */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-10 lg:items-start pt-4">

          {/* Mobile-only (<md): merged nav list + vertical social icons */}
          <div className="flex justify-between items-start gap-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <span className="text-caps-16-smbld text-[#1A1A1A]/40 uppercase">Navigation</span>
              <ul className="flex flex-col space-y-2.5">
                {[...navColumn1, ...navColumn2].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-caps-26-smbld hover:text-[#FF7DA8] transition-colors uppercase">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center gap-3 pt-8">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="w-[40px] h-[40px] rounded-full bg-gray-500 flex justify-center hover:opacity-80 transition-opacity"
                >
                  <Image src={social.icon} alt={social.alt} width={40} height={40} />
                </Link>
              ))}
            </div>
          </div>

          {/* md+: nav1 | nav2 as a row; dissolves into 2 of the 4 grid columns at lg */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 lg:contents">
            <div className="flex flex-col space-y-3">
              <span className="text-caps-16-smbld text-[#1A1A1A]/40 uppercase">Navigation</span>
              <ul className="flex flex-col space-y-2.5">
                {navColumn1.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-caps-26-smbld hover:text-[#FF7DA8] transition-colors uppercase">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-3 lg:pt-6">
              <ul className="flex flex-col space-y-2.5">
                {navColumn2.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-caps-26-smbld hover:text-[#FF7DA8] transition-colors uppercase">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacts: md = left(info)/right(icons over buttons); lg+ = top(info)/bottom(icons <-> buttons), col-span-2 */}
          <div className="flex flex-col space-y-6 md:flex-row md:items-start md:justify-between md:space-y-0 lg:flex-col lg:justify-start lg:space-y-6 lg:col-span-2 gap-8">
            
            {/* Contacts Child 1 (Added flex-1 for balanced sizing) */}
            <div className="flex flex-col space-y-2 flex-1">
              <span className="text-caps-16-smbld text-[#1A1A1A]/40 uppercase">Contacts</span>
              <p className="text-caps-26-smbld font-bold leading-relaxed tracking-wide text-gray-900 uppercase">
                LOREM IPSUM STR.64 81927 STUTTGART
              </p>
              <p className="text-caps-26-smbld font-bold tracking-wide text-gray-900 lowercase">
                WORTHFIT@GMAIL.COM
              </p>
              <p className="text-caps-26-smbld font-bold tracking-wide text-gray-900">
                089 37319547
              </p>
            </div>

            {/* Contacts Child 2 (Added flex-1 for balanced sizing) */}
            <div className="flex flex-col items-start space-y-4 flex-1 items-start lg:items-end lg:flex-row justify-start lg:justify-between lg:space-y-0 lg:w-full">              {/* icons hidden on mobile — shown next to nav instead */}
              <div className="hidden md:flex flex-wrap items-center gap-4">
                {socialLinks.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    className="w-[40px] h-[40px] rounded-full bg-gray-500 flex justify-center hover:opacity-80 transition-opacity"
                  >
                    <Image src={social.icon} alt={social.alt} width={40} height={40} />
                  </Link>
                ))}
              </div>

           <div className="flex items-center gap-3 max-lg:w-full">
              <Button asChild variant="default" className="max-lg:flex-1">
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button asChild variant="secondary" className="max-lg:flex-1">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
            </div>

          </div>

        </div>

        {/* Bottom Legal & Copyright Bar — perfectly aligned with parent max-w and padding */}
        <div className="w-full">
          <div className="flex flex-col xl:flex-row justify-between items-center md:items-start xl:items-center pt-8 border-t border-gray-100 gap-[30px] md:text-left">
            <p className="text-caps-16-smbld text-[#1A1A1A]/40 uppercase">
              © WORTHFIT BY STEFFI 2025. MADE WITH LOVE BY DIEIDEENSCHMIEDE.IO
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:text-left xl:flex xl:justify-end xl:gap-x-11">
              {legalLinks.map((link, idx) => (
                <Link key={idx} href={link.href} className="text-caps-16-smbld text-[#1A1A1A]/40 uppercase hover:text-gray-900 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}