'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1870px] mx-auto px-[20px] lg:px-[45px] w-full ${className}`}>
      {children}
    </div>
  );
}

const HEADING_VH = 1;
const HOLD_AT_SMALL_VH = 0.4;
const GROW_VH = 2.6;
const BUTTON_VH = 1.5;
const BUBBLE_VH = 0.6;

const TOTAL_VH =
  HEADING_VH + HOLD_AT_SMALL_VH + GROW_VH + BUTTON_VH + BUBBLE_VH;

const SMALL_SCALE = 0.36;

export default function TogetherSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2RefTyped = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (
      !sectionRef.current ||
      !pinRef.current ||
      !line1Ref.current ||
      !line2RefTyped.current ||
      !textWrapRef.current ||
      !bubbleRef.current ||
      !buttonRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([line1Ref.current, line2RefTyped.current], { opacity: 1, y: 0 });
        gsap.set(textWrapRef.current, { scale: 1, opacity: 1 });
        gsap.set(buttonRef.current, { y: 0, opacity: 1 });
        gsap.set(bubbleRef.current, { scale: 1, opacity: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(line1Ref.current, { opacity: 0, y: 24, force3D: true });
        gsap.set(line2RefTyped.current, { opacity: 0, y: 24, force3D: true });
        gsap.set(textWrapRef.current, {
          scale: SMALL_SCALE,
          opacity: 0,
          transformOrigin: '50% 50%',
          force3D: true,
        });
        gsap.set(buttonRef.current, { opacity: 0, y: 40, force3D: true });
        gsap.set(bubbleRef.current, { scale: 0, opacity: 0, transformOrigin: '50% 50%', force3D: true });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${TOTAL_VH * 100}%`,
            scrub: 0.5,
            pin: pinRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        let t = 0;

        tl.to(line1Ref.current, { opacity: 1, y: 0 }, t);
        tl.to(line2RefTyped.current, { opacity: 1, y: 0 }, t + HEADING_VH * 0.5);
        t += HEADING_VH;

        tl.to(textWrapRef.current, { opacity: 1 }, t);
        t += HOLD_AT_SMALL_VH;

        tl.to(textWrapRef.current, { scale: 1 }, t);
        t += GROW_VH;

        tl.to(
          buttonRef.current,
          { y: 0, opacity: 1, ease: 'power2.out' },
          t
        );

        tl.to(
          bubbleRef.current,
          { scale: 1, opacity: 1, ease: 'back.out(1.7)' },
          t + BUTTON_VH * 0.4
        );
        t += BUTTON_VH + BUBBLE_VH;
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#32D4C5]"
      style={{ height: `calc(100vh + ${TOTAL_VH * 100}vh)` }}
    >
      <div
        ref={pinRef}
        className="absolute inset-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      >
        <Container className="flex flex-col items-center text-center">

          <h3 className="text-h3-02 max-w-[550px] mb-[45px] text-white flex flex-col">
            <span ref={line1Ref} className="block will-change-transform">
              YOUR LIFE IS A STORY —
            </span>
            <span ref={line2RefTyped} className="block will-change-transform">
              LET'S WRITE YOUR CHAPTER
            </span>
          </h3>

          <div className="relative w-full flex items-center justify-center">
            <div ref={textWrapRef} className="w-full will-change-transform">
              <Image
                src="/icons/together-text.svg"
                alt="Together"
                width={1870}
                height={300}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            <div
              ref={bubbleRef}
              className="absolute z-10 pointer-events-none will-change-transform w-[158px] h-[158px] lg:w-[262px] lg:h-[262px] right-[5%] lg:right-[8.2%] -top-[100px] lg:-top-[175px]"
            >
              <Image
                src="/icons/bubble-together.svg"
                alt="Become the heroine you were always meant to be"
                width={262}
                height={262}
                className="w-full h-full object-contain"
              />
            </div>

          </div>

          <div ref={buttonRef} className="mt-[80px] will-change-transform">
            <Button asChild variant="white">
              <a href="#contact">START YOUR GLOW JOURNEY</a>
            </Button>
          </div>

        </Container>
      </div>
    </section>
  );
}