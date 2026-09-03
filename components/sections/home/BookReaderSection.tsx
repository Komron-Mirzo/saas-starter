'use client';

import React from 'react';
import Image from 'next/image';
import BookReaderFlipBook from './BookReaderFlipBook';

export default function BookReaderSection() {
  return (
    <section className="w-full bg-[#F3F3F3] px-[25px] flex justify-center items-center">
      <div className="w-full bg-[#30D5C8] rounded-[80px] p-[155px] relative flex flex-col xl:flex-row items-center justify-between gap-12 overflow-hidden">
        
        {/* Left Side: Exact Asset Dimensions Integration (Bubbles: 447x523, Worthy: 285x380) */}
        <div className="relative flex flex-col items-center xl:items-start shrink-0">
          <div className="relative min-w-[710px] min-h-[749px] h-full max-w-full flex items-center justify-center">
            
            {/* SVG Bubbles containing the baked-in text */}
            <div className="absolute w-[447px] h-[523px] pointer-events-none right-0 top-0">
              <Image
                src="/icons/bubbles.svg"
                alt="Speech bubble text"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Character positioned precisely relative to the bubble */}
            <div className="absolute bottom-0 left-0 w-[285px] h-[380px] pointer-events-none">
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
          <BookReaderFlipBook />
        </div>

      </div>
    </section>
  );
}