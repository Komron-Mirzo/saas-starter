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
    <div className="w-[344px] md:w-full mx-auto bg-white rounded-[40px] md:rounded-[75px] flex flex-col md:flex-row overflow-hidden h-auto md:h-[422px] max-[1024px]:!h-[553px] max-[400px]:w-[300px]">
      
      {/* Left Thumbnail/Illustration Part */}
      <div className="w-full md:w-[49%] p-[10px_10px_0_10px] md:p-[15px_0_15px_15px] relative flex items-center justify-center flex-shrink-0">
        <div className="w-full h-[209px] md:h-full relative rounded-[30px] md:rounded-[60px] overflow-hidden bg-teal-400">
          <Image
            src={feature.imageUrl}
            alt={feature.title}
            fill
            sizes="(max-width: 768px) 344px, 450px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Content Part */}
      <div className="w-full md:w-[51%] p-[0_25px_60px_25px] md:p-[72px] max-[1650px]:!p-[3vw] max-[1024px]:!py-[4.5vw] max-[1024px]:!px-[3vw] max-[768px]:!p-[25px] flex flex-col justify-center">
        <h3 className="text-h4-02 text-[#1b1b1b] max-[768px]:!text-[22px] max-[1350px]:!text-[25px] max-[1024px]:!text-[22px] mb-[15px] md:mb-[20px] uppercase">
          {feature.title}
        </h3>
        
        <div className="text-body-16 flex h-full flex-col gap-3 text-sm md:text-base max-[768px]:!text-[14px] max-[1350px]:!text-[14px] max-[1024px]:!text-[15px] text-[#1b1b1b]/80 font-normal leading-relaxed line-clamp-4">
          {feature.description.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

    </div>
  );
}