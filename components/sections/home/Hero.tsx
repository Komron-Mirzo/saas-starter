import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="w-full bg-[#f3f3f3] pt-[0px] pb-[120px] lg:pb-[160px] overflow-hidden">
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
          <h1 className="text-h1-01 max-lg:!text-[8.9vw] max-md:!text-[46px] uppercase tracking-tight text-[#FF7DA8]">
            This is your story. <span className="max-md:hidden"><br /></span>
            Just worth it.
          </h1>

          <p className="max-w-xl text-xs sm:text-sm font-medium text-gray-700 leading-relaxed uppercase tracking-wider">
            Step into a world where you're the heroine — and every workout, every meal, every small win becomes part of your powerful story.
          </p>

          {/* Dual Action Buttons using Global Reusable Button Component */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 w-full sm:w-auto">
            <Button asChild variant="default" className="max-md:w-full">
              <Link href="/sign-up">Begin your glow story</Link>
            </Button>

            <Button asChild variant="white" className="max-md:w-full">
              <Link href="#peek-inside">Not sure yet? Peek inside</Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}