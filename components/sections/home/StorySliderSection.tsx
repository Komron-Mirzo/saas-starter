'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import type { StorySliderWithGains } from '@/lib/db/schema';
import VerticalSliderContentCard from './StorySliderContentCard';

interface StorySliderSectionProps {
  slides: StorySliderWithGains[];
}

export default function StorySliderSection({ slides }: StorySliderSectionProps) {
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

  if (!slides || slides.length === 0) return null;

  return (
    <section
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
              <VerticalSliderContentCard slide={slide} />
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
    </section>
  );
}