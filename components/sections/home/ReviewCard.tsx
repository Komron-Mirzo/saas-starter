import React from 'react';
import Image from 'next/image';

// Match the exact field names coming from your database schema
export type Review = {
  id: number;
  quote: string;
  authorName: string;
  location: string;
  avatarUrl: string | null;
};

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="w-full bg-white rounded-[60px] max-md:rounded-[40px] max-md:min-h-[525px] flex md:flex-row flex-col overflow-hidden">
      
      {/* Left Part: 40% width, 15px padding, 40px border-radius */}
      <div className="w-[40%] max-w-[280px] max-md:max-w-full min-h-[403px] max-lg:min-h-[434px] max-md:min-h-[208px] max-md:w-full p-[15px] pr-[0px] max-md:pr-[10px] max-md:p-[10px] max-md:pb-[0px] relative flex-shrink-0">
        <div className="w-full h-full relative max-md:h-[208px] max-md:w-full rounded-[45px] max-md:rounded-[30px] overflow-hidden bg-gray-100">
          {review.avatarUrl && (
            <Image
                src={review.avatarUrl}
                alt={review.authorName}
                fill
                sizes="(max-width: 280px) 100vw, 280px"
                className="object-cover"
                />
          )}
        </div>
      </div>

      {/* Right Part: 60% width, 45px padding, space-between layout */}
      <div className="w-[60%] justify-between p-[45px] max-lg:pl-[35px] max-md:w-full max-md:p-[25px] max-md:pb-[35px] flex flex-col justify-between">
        
        {/* Top Section: Quote Icon & Body Text */}
        <div className="flex flex-col">
          {/* Quote SVG (38x35px, #1b1b1b fill) */}
          <div className="w-[38px] max-lg:w-[27px] h-auto relative mb-[25px] max-md:mb-[20px] flex-shrink-0">
            <Image
              src="/icons/review-quote.svg"
              alt="Quote"
              width={38}
              height={35}
              className="w-[38px] h-[35px] object-contain text-[#1b1b1b]"
            />
          </div>

          {/* Body Text 16 class with 1b1b1b-80% opacity */}
          <p className="text-body-16 text-[#1b1b1b]/80">
            &ldquo;{review.quote}&rdquo;
          </p>
        </div>

        {/* Bottom Section: Name and Location (5px gap) */}
        <div className="flex flex-col gap-[5px] mt-[25px]">
          <h4 className="text-h4-02 text-[#1b1b1b] uppercase max-md:mt-auto">
            {review.authorName}
          </h4>
          <span className="text-caps-16-smbld text-[#1b1b1b]/40 uppercase">
            {review.location}
          </span>
        </div>

      </div>

    </div>
  );
}