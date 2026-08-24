import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="w-full bg-[#F8F9FA] pt-6 pb-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
        
        {/* Top Hero Graphic Banner */}
        <div className="w-full max-w-6xl mb-12 relative flex justify-center">
          <Image
            src="/images/home-hero.png"
            alt="Worthfit by Steffi Hero Collage"
            width={1400}
            height={600}
            unoptimized={true}
            priority
            className="w-full h-auto object-contain rounded-[32px] md:rounded-[48px]"
          />
        </div>

        {/* Headline & Typography Block */}
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#FF7DA8] leading-[1.05] drop-shadow-sm">
            This is your story.<br />
            Just worth it.
          </h1>

          <p className="max-w-xl text-xs sm:text-sm font-medium text-gray-700 leading-relaxed uppercase tracking-wider">
            Step into a world where you're the heroine — and every workout, every meal, every small win becomes part of your powerful story.
          </p>

          {/* Dual Action Buttons with Retro Hard Shadow */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <Button 
              asChild
              className="w-full sm:w-auto rounded-full text-xs sm:text-sm font-black uppercase px-8 py-6 bg-[#FF7DA8] hover:bg-[#ff6598] text-white shadow-[4px_4px_0px_0px_#000000] border-2 border-black transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Link href="/sign-up">Begin your glow story</Link>
            </Button>

            <Button 
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-full text-xs sm:text-sm font-black uppercase px-8 py-6 bg-white hover:bg-gray-50 text-gray-900 shadow-[4px_4px_0px_0px_#000000] border-2 border-black transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Link href="#peek-inside">Not sure yet? Peek inside</Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}