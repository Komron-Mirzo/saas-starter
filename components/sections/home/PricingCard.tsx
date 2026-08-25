import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PricingCardProps {
    title: string;
    price: string;
    badge?: string;
    imageSrc: string;
    imageAlt: string;
    features: string[];
    buttonText?: string;
    buttonHref?: string;
}

export function PricingCard({
    title,
    price,
    badge = "FREE 1ST WEEK",
    imageSrc,
    imageAlt,
    features,
    buttonText = "START YOUR JOURNEY",
    buttonHref = "/sign-up",
}: PricingCardProps) {
    return (
        <div className="bg-white rounded-[60px] py-[45px] px-[15px] flex flex-col justify-between relative transition-transform duration-200 hover:-translate-y-1">

            {/* Top Header & Price Pill */}
            <div className="flex flex-col px-[30px] space-y-2 mb-2 z-20 items-start text-left">
                <h4 className="text-h4-02 text-lg mb-[20px] font-black tracking-wider uppercase text-gray-900">
                    {title}
                </h4>

                {/* Price & Free Trial Pill Wrapper */}
                <div className="relative flex flex-col items-start w-fit">
                   <div className="bg-[#FF7DA8] text-white not-italic text-[34px] leading-[0.9] pt-[9px] pr-[15px] pb-[6px] pl-[15px] rounded-full"
                    style={{ fontFamily: 'var(--font-worthfit), sans-serif' }}
                    >
                    {price}
                    </div>

                    {badge && (
                        <h6 className="text-h6-02 text-white mt-[-12px] self-end translate-x-[32px] z-10 bg-[#30D5C8] px-[12px] py-[6px] rounded-full uppercase -rotate-[8deg] shadow-sm">
                            {badge}
                        </h6>
                    )}
                </div>
            </div>

            {/* Graphic Area: 155px background container with overlapping image */}
            <div className="relative w-full h-[165px] my-6 flex items-center justify-center">
                {/* The Grey Background Box */}
                <div className="w-full h-full bg-[#F3F3F3] rounded-[24px]"></div>

                {/* The Overlapping Image (Spilling out of the top) */}
                <div className="absolute -top-7 w-full h-[190px] flex items-center justify-center pointer-events-none">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                        unoptimized={true}
                    />
                </div>
            </div>

            {/* Features List */}
            <div className="flex flex-col px-[30px] space-y-3 mb-8 text-left">
                <span className=" text-caps-18-smbld">
                    INCLUDES:
                </span>
                <ul className="space-y-2">
                    {features.map((feature, idx) => (
                        <li key={idx} className="text-body-16 text-[rgba(26,26,26,0.8)]">
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Button */}
            <div className="w-full mt-auto px-[30px]">
                <Button asChild className="w-full">
                    <Link href={buttonHref}>{buttonText}</Link>
                </Button>
            </div>

        </div>
    );
}