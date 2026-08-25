import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="w-full bg-[#F8F9FA] pt-6 pb-16 overflow-hidden">
      <div className="max-w-[1870px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
        
        {/* Top Hero Graphic Banner */}
        <div className="w-full mb-12 relative flex justify-center">
          <Image
            src="/images/home-hero.png"
            alt="Worthfit by Steffi Hero Collage"
            width={1870}
            height={635}
            unoptimized={true}
            priority
            className="w-full h-auto object-contain rounded-[32px] md:rounded-[48px]"
          />
        </div>

        {/* Headline & Typography Block */}
        <div className="mx-auto flex flex-col items-center space-y-6">
          <h1 className="text-h1-01 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#FF7DA8] leading-[1.05] drop-shadow-sm">
            This is your story.<br />
            Just worth it.
          </h1>

          <p className="max-w-xl text-xs sm:text-sm font-medium text-gray-700 leading-relaxed uppercase tracking-wider">
            Step into a world where you're the heroine — and every workout, every meal, every small win becomes part of your powerful story.
          </p>

          {/* Dual Action Buttons using Global Reusable Button Component */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 w-full sm:w-auto">
            <Button asChild variant="default">
              <Link href="/sign-up">Begin your glow story</Link>
            </Button>

            <Button asChild variant="white">
              <Link href="#peek-inside">Not sure yet? Peek inside</Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}