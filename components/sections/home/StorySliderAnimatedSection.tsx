'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StorySliderWithGains } from '@/lib/db/schema';
import StorySliderContentCard, { StorySliderContentCardMobile } from './StorySliderContentCard';

gsap.registerPlugin(ScrollTrigger);

interface Props {
    slides: StorySliderWithGains[];
}

export default function StorySliderAnimatedSection({ slides }: Props) {
    // ── Embla (desktop, unchanged) ───────────────────────────────────────
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

    // ── Refs: desktop (unchanged) ────────────────────────────────────────
    const outerRef    = useRef<HTMLDivElement>(null);
    const stickyRef   = useRef<HTMLDivElement>(null);
    const bgRef       = useRef<HTMLDivElement>(null);
    const worthyRef   = useRef<HTMLDivElement>(null);
    const bubbleRef   = useRef<HTMLDivElement>(null);
    const circleRef   = useRef<HTMLDivElement>(null);
    const sliderRef   = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLParagraphElement>(null);

    // ── Refs: mobile intro (new) ─────────────────────────────────────────
    const outerMobileRef  = useRef<HTMLDivElement>(null);
    const stickyMobileRef = useRef<HTMLDivElement>(null);
    const bgMobileRef     = useRef<HTMLDivElement>(null);
    const worthyMobileRef = useRef<HTMLDivElement>(null);
    const bubbleMobileRef = useRef<HTMLDivElement>(null);

    // ── GSAP ScrollTrigger — desktop (unchanged) + mobile (new), scoped ───
    useEffect(() => {
        const mm = gsap.matchMedia();

        // Desktop: full 4-step pinned animation (unchanged)
        mm.add('(min-width: 768px)', () => {
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
            };
        });

        // Mobile: intro-only animation — bg rotates, mascot + bubble appear.
        // No circle expand, no slider rise — slider is a separate, unpinned
        // section that simply follows in normal document flow.
        mm.add('(max-width: 767px)', () => {
            if (!outerMobileRef.current) return;

            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: outerMobileRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.2,
                        pin: stickyMobileRef.current,
                        pinSpacing: false,
                        anticipatePin: 1,
                    },
                });

                // Mascot slides/fades in
                tl.fromTo(
                    worthyMobileRef.current,
                    { autoAlpha: 0, y: 40 },
                    { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.5 },
                    0
                );

                // Bubble fades in (same easing as desktop step 02)
                tl.fromTo(
                    bubbleMobileRef.current,
                    { autoAlpha: 0, scale: 0.7 },
                    { autoAlpha: 1, scale: 1, ease: 'back.out(1.4)', duration: 0.5 },
                    0.2
                );

            }, outerMobileRef);

            const rotTweenMobile = gsap.to(bgMobileRef.current, {
                rotation: 360,
                duration: 18,
                repeat: -1,
                ease: 'none',
                transformOrigin: '50% 50%',
            });

            return () => {
                ctx.revert();
                rotTweenMobile.kill();
            };
        });

        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    // ── Embla (mobile slider, unchanged from previous pass) ───────────────
    const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
        axis: 'x',
        loop: true,
        align: 'start',
        slidesToScroll: 1,
    });
    const [mobileSelectedIndex, setMobileSelectedIndex] = useState(0);
    const [mobileScrollSnaps, setMobileScrollSnaps] = useState<number[]>([]);

    const scrollToMobile = useCallback(
        (index: number) => mobileEmblaApi?.scrollTo(index),
        [mobileEmblaApi]
    );

    useEffect(() => {
        if (!mobileEmblaApi) return;
        const onSelect = () => setMobileSelectedIndex(mobileEmblaApi.selectedScrollSnap());
        const onReInit = () => setMobileScrollSnaps(mobileEmblaApi.scrollSnapList());
        setMobileScrollSnaps(mobileEmblaApi.scrollSnapList());
        mobileEmblaApi.on('select', onSelect);
        mobileEmblaApi.on('reInit', onReInit);
        return () => {
            mobileEmblaApi.off('select', onSelect);
            mobileEmblaApi.off('reInit', onReInit);
        };
    }, [mobileEmblaApi]);

    if (!slides || slides.length === 0) return null;

    return (
        <section id="story-worlds">
            {/* ══════════════════ DESKTOP (≥768px) — unchanged ══════════════════ */}
            <div className="hidden md:block">
                {/*
                 * ── Outer wrapper ──────────────────────────────────────────────────
                 * 25px margin on all sides keeps it away from the page edge.
                 * border-radius 120px + overflow hidden clips the sticky stage
                 * so the rounded corners are always visible during every animation step.
                 */}
                <div
                    className="m-[20px] lg:m-[25px] h-[calc(500vh-40px)] lg:h-[calc(500vh-50px)] rounded-[120px] max-[1025px]:rounded-[80px] realtive overflow-hidden"
                >
                    {/* outerRef is the ScrollTrigger anchor */}
                    <div ref={outerRef} style={{ height: '100%' }}>

                        {/* ── Sticky stage ── */}
                            <div
                                ref={stickyRef}
                                className="sticky top-[20px] lg:top-[25px] w-full h-[calc(100vh-40px)] lg:h-[calc(100vh-50px)] overflow-hidden bg-[#f3f3f3] rounded-[80px] lg:rounded-[120px]"
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
                                className="absolute w-[600px] max-[1281px]:w-[384px] h-[500px] max-[1281px]:h-[319px] left-[45%] max-[1281px]:left-[40%] top-[50%] max-[1281px]:top-[50%] -translate-x-[62%] -translate-y-[52%] max-[1281px]:-translate-x-1/2 max-[1281px]:-translate-y-1/2 z-[5] opacity-0 invisible pointer-events-none"
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
                                className="w-[287px] max-[1280px]:w-[184px] h-[383px] max-[1280px]:h-[245px] right-[27%] max-[1500px]:right-[20%] max-[1280px]:right-[30%] absolute bottom-[166px] max-[1280px]:bottom-[8.6%] z-[6]"
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
                                        className="overflow-hidden rounded-[80px] lg:rounded-[120px]"
                                        ref={emblaRef}
                                        style={{ minHeight: '830px', height: '100%' }}
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
                                    <div className="absolute flex flex-col gap-3 right-[6.5%] max-[1700px]:right-[50px] max-[1500px]:right-[20px] top-1/5 -translate-y-1/5 z-[20]">
                                        <button
                                            onClick={scrollPrev}
                                            aria-label="Previous slide"
                                            className="bg-white flex items-center justify-center shadow-md transition-opacity hover:opacity-80 size-[160px] max-[1300px]:size-[100px] rounded-full border-0 cursor-pointer"
                                        >
                                            <svg width="45" height="55" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                                <path d="M10 15V5M5 10l5-5 5 5" stroke="#00BFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={scrollNext}
                                            aria-label="Next slide"
                                            className="bg-white flex items-center justify-center shadow-md transition-opacity hover:opacity-80 size-[160px] max-[1300px]:size-[100px] rounded-full border-0 cursor-pointer"
                                        >
                                            <svg width="45" height="55" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                                <path d="M10 5v10M15 10l-5 5-5-5" stroke="#00BFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════ MOBILE (<768px) — intro animation ══════════════════
             * Separate pinned section: rotating bg + mascot + bubble only.
             * Ends here — no circle expand, no slider rise.
             */}
            <div className="block md:hidden">
                <div className="m-[20px] h-[calc(200vh-40px)] rounded-[40px] overflow-hidden">
                    <div ref={outerMobileRef} style={{ height: '100%' }}>
                        <div
                            ref={stickyMobileRef}
                            className="sticky top-[20px] w-full h-[calc(100vh-40px)] overflow-hidden bg-[#f3f3f3] rounded-[40px]"
                        >
                            {/* Rotating sunburst bg */}
                            <div
                                ref={bgMobileRef}
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

                            {/* Speech bubble */}
                            <div
                                ref={bubbleMobileRef}
                                className="absolute z-[5] opacity-0 invisible pointer-events-none left-[38%] top-[43vh] max-[500px]:top-[35vh] max-[500px]:left-[50%]"
                                style={{
                                    width: '280px',
                                    height: '233px',
                                    transform: 'translate(-50%, -50%)',
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
                                ref={worthyMobileRef}
                                className="absolute z-[6]"
                                style={{
                                    width: '150px',
                                    height: '200px',
                                    left: '63%',
                                    bottom: '15vh',
                                    transform: 'translateX(-50%)',
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
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════ MOBILE (<768px) — slider section ══════════════════
             * Plain next section, normal document flow, no GSAP/pin at all.
             */}
            <div className="block md:hidden">
                <div
                    className="relative overflow-hidden"
                    style={{ background: '#FF7DA8', padding: '100px 0' }}
                >
                    <div className="overflow-hidden px-[20px]" ref={mobileEmblaRef}>
                        <div className="flex">
                            {slides.map((slide) => (
                                <div key={slide.id} className="flex-[0_0_100%] max-[400px]:flex-[0_0_100%] min-[401px]:max-[767px]:flex-[0_0_344px] min-[768px]:flex-[0_0_400px] pr-[16px]">
                                    <StorySliderContentCardMobile slide={slide} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots — 6px square @ 60% white, active 10px square @ full white */}
                    <div className="flex justify-center items-center gap-2 mt-[24px]">
                        {mobileScrollSnaps.map((_, index) => {
                            const isActive = index === mobileSelectedIndex;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => scrollToMobile(index)}
                                    aria-label={`Go to slide group ${index + 1}`}
                                    className="rounded-full transition-all"
                                    style={{
                                        width: isActive ? '10px' : '6px',
                                        height: isActive ? '10px' : '6px',
                                        background: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}