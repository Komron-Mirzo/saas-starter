import React from 'react';
import Image from 'next/image';

export type Feature = {
  id: number;
  title: string;
  description: string[];
  imageUrl: string;
};

interface FeatureSliderCardProps {
  feature: Feature;
}

export function FeatureSliderCard({ feature }: FeatureSliderCardProps) {
  return (
    <div className="w-full bg-white rounded-[75px] flex flex-col md:flex-row overflow-hidden h-[clamp(320px,22vw,422px)]">
      
      {/* Left Thumbnail/Illustration Part (approx 45% width) */}
      <div className="w-full md:w-[49%] p-[15px_0_15px_15px] relative flex items-center justify-center flex-shrink-0">
        <div className="w-full h-full min-h-[220px] relative rounded-[60px] overflow-hidden bg-teal-400">
          <Image
            src={feature.imageUrl}
            alt={feature.title}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Content Part (approx 55% width) */}
      <div className="w-full md:w-[51%] p-[72px] flex flex-col justify-center">
        <h3 className="text-h4-02 text-[#1b1b1b] mb-[20px] uppercase">
          {feature.title}
        </h3>
        
        <div className=" text-body-16 flex flex-col gap-3 text-sm md:text-base text-[#1b1b1b]/80 font-normal leading-relaxed line-clamp-4">
          {feature.description.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

    </div>
  );
}