import React from 'react';
import { db } from '@/lib/db/drizzle';
import { reviewsTable } from '@/lib/db/schema';
import CommunityReviewsSlider from './ReviewSlider';

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1870px] mx-auto px-8 w-full ${className}`}>
      {children}
    </div>
  );
}

export default async function ReviewSection() {
  // Fetch reviews directly from the database (Server Component)
  const reviews = await db.select().from(reviewsTable);

  return (
    <section className="relative w-full py-24 overflow-hidden">
      <Container className="flex flex-col items-center text-center">
        <div className="inline-block border border-gray-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#1b1b1b] mb-6 bg-white shadow-sm">
          COMMUNITY
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold italic tracking-tight text-[#1b1b1b] max-w-4xl uppercase leading-none mb-6">
          The journey is better when we shine together.
        </h2>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-16 font-medium">
          Behind every win is a squad cheering you on — led by our mascot Worthy. Join our private WhatsApp group, take part in monthly challenges, win your Glow Queen crown, and celebrate every victory — big or small — with women who just get it.
        </p>
      </Container>

      {/* Database-driven Embla Infinite Slider */}
      <CommunityReviewsSlider reviews={reviews} />

      {/* Floating Center Action Button */}
      <div className="flex justify-center -mt-6 relative z-20">
        <button className="bg-[#32D4C5] text-[#1b1b1b] font-extrabold uppercase tracking-wider text-sm px-8 py-4 rounded-full shadow-2xl hover:bg-[#2bc2b3] transition-all transform hover:-translate-y-1">
          START YOUR FREE TRIAL
        </button>
      </div>
    </section>
  );
}