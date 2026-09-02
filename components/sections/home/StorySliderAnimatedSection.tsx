'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StorySliderWithGains } from '@/lib/db/schema';
import StorySliderContentCard from './StorySliderContentCard';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  slides: StorySliderWithGains[];
}

export default function StorySliderAnimatedSection({ slides }: Props) {
  // ── Embla ──────────────────────────────────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    loop: true,
    dragFree: false,
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // ── Refs ───────────────────────────────────────────────────────────────
  const outerRef     = useRef<HTMLDivElement>(null); // scroll-pinned container
  const stickyRef    = useRef<HTMLDivElement>(null); // the sticky inner stage
  const bgRef        = useRef<HTMLDivElement>(null); // rotating sunburst bg
  const worthyRef    = useRef<HTMLDivElement>(null); // mascot
  const bubbleRef    = useRef<HTMLDivElement>(null); // speech bubble
  const circleRef    = useRef<HTMLDivElement>(null); // expanding pink circle
  const sliderRef    = useRef<HTMLDivElement>(null); // embla slider panel
  const categoryRef  = useRef<HTMLParagraphElement>(null);

  // ── GSAP ScrollTrigger ─────────────────────────────────────────────────
  useEffect(() => {
    if (!outerRef.current) return;

    const ctx = gsap.context(() => {
      /*
       * The outer div is tall enough to give us scroll distance for 5 "steps".
       * We pin the inner sticky stage so everything plays inside it.
       *
       * scroll budget per step (approx):
       *   step-01  0%–15%   – just bg rotating (immediate, on enter)
       *   step-02  15%–35%  – bubble fades in, stays
       *   step-03  35%–60%  – bubble out + circle expands, worthy goes down
       *   step-04  60%–100% – slider rises from bottom
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      // ── Step 01: bg already visible; start rotating immediately ──────
      // (bg rotation is a continuous tween, not scroll-driven – see below)

      // ── Step 02: bubble fades in ──────────────────────────────────────
      tl.fromTo(
        bubbleRef.current,
        { autoAlpha: 0, scale: 0.7 },
        { autoAlpha: 1, scale: 1, ease: 'back.out(1.4)', duration: 0.18 },
        0.10   // starts at 10% of total scroll progress
      );

      // bubble stays (no tween needed – just gap until step-03)

      // ── Step 03a: bubble fades out ────────────────────────────────────
      tl.set(bubbleRef.current, { autoAlpha: 0, scale: 0 }, 0.36);

      // ── Step 03b: circle expands to cover entire stage ────────────────
      // starts tiny (0px) at center, grows to ~2× the diagonal of the stage
      tl.fromTo(
        circleRef.current,
        { scale: 0, autoAlpha: 1 },
        { scale: 1, ease: 'power2.inOut', duration: 0.22 },
        0.36
      );

      // ── Step 03c: worthy slides down off-screen ───────────────────────
      tl.to(
        worthyRef.current,
        { y: '100%', autoAlpha: 0, ease: 'power2.in', duration: 0.18 },
        0.38
      );

      // ── Step 04: slider panel rises from below ────────────────────────
      tl.fromTo(
        sliderRef.current,
        { y: '100%', autoAlpha: 0 },
        { y: '0%', autoAlpha: 1, ease: 'power3.out', duration: 0.28 },
        0.62
      );

      // category label fades in with slider
      tl.fromTo(
        categoryRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.14 },
        0.70
      );

    }, outerRef);

    // ── Continuous bg rotation (not scroll-driven) ────────────────────
    const rotTween = gsap.to(bgRef.current, {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });

    return () => {
      ctx.revert();
      rotTween.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    /**
     * outerRef: tall scroll container – height controls how much scroll
     * you need to traverse each step. 500vh gives generous breathing room.
     */
    <div ref={outerRef} style={{ height: '500vh' }}>
      {/* ── Sticky stage – 100vh tall, clips everything ── */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#f3f3f3',
        }}
      >
<div
          ref={bgRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '400vw',
            height: '400vw',
            transform: 'translate(-50%, -50%)',
            backgroundImage: 'url(/images/comic-slider-bg.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformOrigin: '50% 50%',
            zIndex: 0,
          }}
        />

        {/* ── Pink expanding circle (step-03) ── */}
        {/*
         * Sized to 200vmax so at scale(1) it fully covers the viewport.
         * Starts at scale(0) so it's invisible until step-03.
         */}
        <div
          ref={circleRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '200vmax',
            height: '200vmax',
            borderRadius: '50%',
            background: '#FF7DA8',   // hot-pink matching the brand
            transform: 'translate(-50%, -50%) scale(0)',
            zIndex: 2,
            opacity: 0,
            visibility: 'hidden',
          }}
        />

        {/* ── Speech bubble (step-02) ── */}
        <div
          ref={bubbleRef}
          style={{
            position: 'absolute',
            left: '45%',
            top: '50%',
            transform: 'translate(-62%, -52%)',
            width: '600px',
            height: '500px',
            zIndex: 5,
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <Image
            src="/images/comic-slider-bubble.svg"
            alt="Let me show you story worlds!"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* ── Mascot / Worthy (step-01 visible, step-03 exits down) ── */}
        <div
          ref={worthyRef}
          style={{
            position: 'absolute',
            bottom: '166px',        // 166px below bottom as per spec
            right: '27%',
            width: '287px',
            height: '383px',
            zIndex: 6,
          }}
        >
          <Image
            src="/images/comic-slider-worthy.svg"
            alt="Worthy mascot"
            fill
            style={{ objectFit: 'contain', objectPosition: 'bottom' }}
            priority
          />
        </div>

        {/* ── Slider panel (step-04 – starts off-screen below) ── */}
        <div
          ref={sliderRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            opacity: 0,
            visibility: 'hidden',
            transform: 'translateY(100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '25px',
          }}
        >
          {/* Embla viewport */}
            <div
                className="relative w-full"
                style={{ padding: '25px' }}
                aria-label="Story Sliders"
              >
          
                {/* Embla viewport — fixed height */}
                <div
                  className="overflow-hidden"
                  ref={emblaRef}
                  style={{ borderRadius: '120px', height: '830px' }}
                >
                  <div className="flex flex-col h-full">
                    {slides.map((slide) => (
                      <div
                        key={slide.id}
                        className="flex-none"
                        style={{ height: '850px' }}
                      >
                        <StorySliderContentCard slide={slide} />
                      </div>
                    ))}
                  </div>
                </div>
          
                {/* Navigation buttons — right side, vertically centred */}
                <div
                  className="absolute flex flex-col gap-3"
                  style={{
                    right: '50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                  }}
                >
                  <button
                    onClick={scrollPrev}
                    aria-label="Previous slide"
                    className="bg-white flex items-center justify-center shadow-md transition-opacity hover:opacity-80"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                  >
                    {/* Up arrow */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M10 15V5M5 10l5-5 5 5" stroke="#00BFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
          
                  <button
                    onClick={scrollNext}
                    aria-label="Next slide"
                    className="bg-white flex items-center justify-center shadow-md transition-opacity hover:opacity-80"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                  >
                    {/* Down arrow */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M10 5v10M15 10l-5 5-5-5" stroke="#00BFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                
              </div>
        </div>
      </div>
    </div>
  );
}