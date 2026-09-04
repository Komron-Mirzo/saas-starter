import React from 'react';
import { db } from '@/lib/db/drizzle';
import { reviewsTable } from '@/lib/db/schema';
import ReviewsSlider from './ReviewSlider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1870px] mx-auto w-full ${className}`}>
      {children}
    </div>
  );
}

export default async function ReviewSection() {
  // Fetch reviews directly from the database (Server Component)
  const reviews = await db.select().from(reviewsTable);

  return (
    <section className="relative w-full py-[140px] lg:py-[260px] overflow-hidden">
      <Container className="flex flex-col items-center px-[20px] lg:px-[45px] text-center">
        <div className="text-caps-16-smbld px-[12px] py-[4px] rounded-full text-[#1b1b1b] mb-[25px] bg-white">
          COMMUNITY
        </div>

        <h2 className="uppercase text-h2-02  italic text-[#1b1b1b] max-w-[910px]  mb-[25px]">
          The journey is better when we shine together.
        </h2>

        <p className="text-body-16 text-[#1b1b1b]/60 max-w-[1035px] mb-[75px]">
          Behind every win is a squad cheering you on — led by our mascot Worthy. Join our private WhatsApp group, take part in monthly challenges, win your Glow Queen crown, and celebrate every victory — big or small — with women who just get it.
        </p>
      </Container>

      {/* Database-driven Embla Infinite Slider */}
      <ReviewsSlider reviews={reviews} />

      {/* Floating Center Action Button */}
      <div className="flex justify-center relative z-20 mt-[45px]">
        <Button asChild variant="secondary">
          <Link href="/">
            START YOUR FREE TRIAL
          </Link>
        </Button>
      </div>


    </section>
  );
}