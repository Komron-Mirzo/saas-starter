'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { ReviewCard, Review } from './ReviewCard';

interface ReviewsSliderProps {
  reviews: Review[];
}

export default function ReviewsSlider({ reviews }: ReviewsSliderProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const extendedReviews = reviews.length > 0 && reviews.length < 6 
    ? [...reviews, ...reviews, ...reviews] 
    : reviews;

  return (
    <div className="w-full overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
      {/* Negative margin on parent offsets the item margins, keeping math clean */}
      <div className="flex -mr-[15px]">
        {extendedReviews.map((review, index) => (
          <div 
              key={`${review.id}-${index}`} 
              className="flex-[0_0_300px] min-[361px]:flex-[0_0_344px] md:flex-[0_0_460px] lg:flex-[0_0_773px] min-w-0 mr-[15px]"
            >
              <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}