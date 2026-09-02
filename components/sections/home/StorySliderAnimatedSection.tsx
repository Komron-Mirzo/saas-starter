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
    const outerRef    = useRef<HTMLDivElement>(null);
    const stickyRef   = useRef<HTMLDivElement>(null);
    const bgRef       = useRef<HTMLDivElement>(null);
    const worthyRef   = useRef<HTMLDivElement>(null);
    const bubbleRef   = useRef<HTMLDivElement>(null);
    const circleRef   = useRef<HTMLDivElement>(null);
    const sliderRef   = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLParagraphElement>(null);

    // ── GSAP ScrollTrigger ─────────────────────────────────────────────────
    useEffect(() => {
        if (!outerRef.current) return;

        const ctx = gsap.context(() => {
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

            // Step 02: bubble fades in
            tl.fromTo(
                bubbleRef.current,
                { autoAlpha: 0, scale: 0.7 },
                { autoAlpha: 1, scale: 1, ease: 'back.out(1.4)', duration: 0.18 },
                0.10
            );

            // Step 03a: bubble snaps out
            tl.set(bubbleRef.current, { autoAlpha: 0, scale: 0 }, 0.36);

            // Step 03b: circle expands
            tl.fromTo(
                circleRef.current,
                { scale: 0, autoAlpha: 1 },
                { scale: 1, ease: 'power2.inOut', duration: 0.22 },
                0.36
            );

            // Step 03c: worthy exits down
            tl.to(
                worthyRef.current,
                { y: '100%', autoAlpha: 0, ease: 'power2.in', duration: 0.18 },
                0.38
            );

            // Step 04: slider rises from below
            tl.fromTo(
                sliderRef.current,
                { y: '100%', autoAlpha: 0 },
                { y: '0%', autoAlpha: 1, ease: 'power3.out', duration: 0.28 },
                0.62
            );

            // Category label fades in
            tl.fromTo(
                categoryRef.current,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.14 },
                0.70
            );

        }, outerRef);

        // Continuous bg rotation (independent of scroll)
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
        /*
         * ── Outer wrapper ──────────────────────────────────────────────────
         * 25px margin on all sides keeps it away from the page edge.
         * border-radius 120px + overflow hidden clips the sticky stage
         * so the rounded corners are always visible during every animation step.
         */
        <div
            style={{
                margin: '25px',
                borderRadius: '120px',
                overflow: 'hidden',
                /* height drives scroll budget: 500vh minus the two 25px margins */
                height: 'calc(500vh - 50px)',
            }}
        >
            {/* outerRef is the ScrollTrigger anchor */}
            <div ref={outerRef} style={{ height: '100%' }}>

                {/* ── Sticky stage ── */}
                <div
                    ref={stickyRef}
                    style={{
                        position: 'sticky',
                        top: '25px',
                        width: '100%',
                        /* Fill viewport height but respect the 25px top margin */
                        height: 'calc(100vh - 50px)',
                        overflow: 'hidden',
                        background: '#f3f3f3',
                        borderRadius: '120px',
                    }}
                >

                    {/* Rotating sunburst bg */}
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

                    {/* Pink expanding circle */}
                    <div
                        ref={circleRef}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '200vmax',
                            height: '200vmax',
                            borderRadius: '50%',
                            background: '#FF7DA8',
                            transform: 'translate(-50%, -50%) scale(0)',
                            zIndex: 2,
                            opacity: 0,
                            visibility: 'hidden',
                        }}
                    />

                    {/* Speech bubble */}
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

                    {/* Mascot */}
                    <div
                        ref={worthyRef}
                        style={{
                            position: 'absolute',
                            bottom: '166px',
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

                    {/* Slider panel */}
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
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            className="relative w-full h-full"
                  
                            aria-label="Story Sliders"
                        >
                            {/* Embla viewport */}
                            <div
                                className="overflow-hidden"
                                ref={emblaRef}
                                style={{ borderRadius: '120px', minHeight: '830px', height: '100%' }}
                            >
                                <div className="flex flex-col h-full">
                                    {slides.map((slide) => (
                                        <div
                                            key={slide.id}
                                            className="flex-none min-h-[830px]"
                                            style={{ minHeight: '830px', height: '100%' }}
                                        >
                                            <StorySliderContentCard slide={slide} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nav buttons */}
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
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                        <path d="M10 5v10M15 10l-5 5-5-5" stroke="#00BFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}