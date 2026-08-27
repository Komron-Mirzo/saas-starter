import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Adjust import based on your project structure

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1870px] mx-auto px-8 w-full ${className}`}>
      {children}
    </div>
  );
}

export default function TogetherSection() {
  return (
    <section className="relative w-full h-dvh max-h-[1064px] bg-[#32D4C5] py-50 overflow-hidden flex flex-col items-center justify-center">
      <Container className="flex flex-col items-center text-center">
        
        {/* Small Heading: h3, italic, text color #1b1b1b */}
        <h3 className="text-h3-02 max-w-[550px] mb-[45px] text-white ">
          YOUR LIFE IS A STORY — LET'S WRITE YOUR CHAPTER
        </h3>

        {/* Middle Content Wrapper for Full-Width Text & Overlapping Bubble */}
        <div className="relative w-full flex items-center justify-center">
          
          {/* TOGETHER Text SVG (100% full width) */}
          <div className="w-full">
            <Image 
              src="/icons/together-text.svg" 
              alt="Together" 
              width={1870} 
              height={300} 
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Overlapping Bubble SVG */}
          {/* Size: 262px width & height, 155px from right, overlapping side is 112px height */}
          <div 
            className="absolute z-10 pointer-events-none"
            style={{
              width: '262px',
              height: '262px',
              right: '155px',
              top: '-112px', // Pulls it up by 112px to create the exact overlapping side offset
            }}
          >
            <Image 
              src="/icons/bubble-together.svg" 
              alt="Become the heroine you were always meant to be" 
              width={262} 
              height={262} 
              className="w-full h-full object-contain animate-spin-slow" // Optional slow spin or static
            />
          </div>

        </div>

        {/* Button with variant="white" and asChild, separated by 80px space */}
        <div className="mt-[80px]">
          <Button asChild variant="white">
            <a href="#contact">START YOUR GLOW JOURNEY</a>
          </Button>
        </div>

      </Container>
    </section>
  );
}