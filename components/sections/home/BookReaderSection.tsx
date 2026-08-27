'use client';

import React from 'react';
import Image from 'next/image';
import WatermarkFreeBook from './WatermarkFreeBook';

export default function BookReaderSection() {
  return (
    <section className="w-full bg-white py-12 px-[25px] flex justify-center items-center">
      <div className="w-full bg-[#30D5C8] rounded-[80px] px-8 py-14 md:px-16 md:py-20 relative flex flex-col xl:flex-row items-center justify-between gap-12 overflow-hidden shadow-xl">
        
        {/* Left Side: Exact Asset Dimensions Integration (Bubbles: 447x523, Worthy: 285x380) */}
        <div className="relative flex flex-col items-center xl:items-start shrink-0">
          <div className="relative w-[447px] h-[523px] max-w-full flex items-center justify-center">
            
            {/* SVG Bubbles containing the baked-in text */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <Image
                src="/icons/bubbles.svg"
                alt="Speech bubble text"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Character positioned precisely relative to the bubble */}
            <div className="absolute -bottom-12 -left-6 w-[285px] h-[380px] pointer-events-none">
              <Image
                src="/icons/worthy.svg"
                alt="Worthy character mascot"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

          </div>
        </div>

        {/* Right Side: Unrestricted container allowing the full book height to render cleanly */}
        <div className="relative w-full xl:w-auto flex justify-center items-center">
          <WatermarkFreeBook />
        </div>

      </div>
    </section>
  );
}