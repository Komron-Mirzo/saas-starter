'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { ReviewCard, Review } from './ReviewCard';

interface CommunityReviewsSliderProps {
  reviews: Review[];
}

export default function CommunityReviewsSlider({ reviews }: CommunityReviewsSliderProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  return (
    <div className="w-full overflow-hidden cursor-grab active:cursor-grabbing py-8" ref={emblaRef}>
      <div className="flex gap-8">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="flex-[0_0_800px] md:flex-[0_0_860px]"
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}