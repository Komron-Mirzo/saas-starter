'use client';

import React from 'react';
import Image from 'next/image';
import BookReaderFlipBook from './BookReaderFlipBook';

export default function BookReaderSection() {
  return (
    <section className="w-full bg-[#F3F3F3] px-[25px] max-[1024px]:px-[20px] flex justify-center items-center">
      <div className="w-full bg-[#30D5C8] rounded-[80px] max-[1024px]:rounded-[50px] py-[155px] max-[1024px]:py-[80px] px-[20px] overflow-hidden">

        <div className="max-w-[1560px] min-w-0 relative flex flex-col lg:flex-row items-end m-auto justify-between max-[1024px]:gap-[50px]">
          {/* Left Side: Exact Asset Dimensions Integration (Bubbles: 447x523, Worthy: 285x380) */}
          <div className="relative w-[42%] max-[1024px]:w-full max-[1024px]:max-w-[466px] m-auto flex flex-col items-center xl:items-start shrink-0">
            <div className="relative w-full min-h-[749px] max-[1280px]:min-h-[600px] max-[1024px]:min-h-0 h-full max-w-full flex flex-col items-center justify-center">

              {/* SVG Bubbles containing the baked-in text */}
              <div className="absolute max-[1024px]:relative max-w-[447px] max-h-[523px] w-[23vw] h-[27vw] pointer-events-none right-0 top-0 max-[1024px]:w-[207px] max-[1024px]:h-[261px] max-[1024px]:ml-auto max-[1024px]:-mb-[84px]">
                <Image
                  src="/icons/bubbles.svg"
                  alt="Speech bubble text"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Character positioned precisely relative to the bubble */}
              <div className="absolute max-[1024px]:relative bottom-0 left-0 w-[285px] h-[380px] max-[1024px]:w-[189px] max-[1024px]:h-[252px] max-[500px]:mr-auto pointer-events-none">
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

          {/* Right Side: add min-w-0 so this flex item can shrink below the flipbook's intrinsic width */}
          <div className="relative w-[58%] max-[1024px]:w-full max-[1024px]:max-w-[466px] m-auto min-w-0 flex justify-center items-center">
            <BookReaderFlipBook />
          </div>
        </div>



      </div>
    </section>
  );
}