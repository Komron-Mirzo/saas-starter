'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Faq = {
  id: number;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  faqs: Faq[];
};

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="w-full max-w-[1650px] lg:px-[45px] px-[20px] lg:py-[260px] py-[140px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">

      {/* Left Container */}
      <div className="w-full lg:max-w-[641px] flex flex-col">

        {/* FAQ Tag */}
        <div className="self-start bg-white px-[12px] py-[4px] rounded-full mb-[25px]">
          <span className="text-caps-14-smbld uppercase text-[#1b1b1b]">
            FAQ
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-h1-02 text-[#1b1b1b] lg:mb-[60px] mb-0 leading-tight">
          Still have questions? Let&apos;s clear things up
        </h2>

        {/* Desktop Button (Visible only on LG screens and above) */}
        <div className="hidden lg:block">
           <Button asChild variant="default" className="w-[291px]">
              <Link href="/">START YOUR FREE TRIAL</Link>
            </Button>
        </div>

      </div>

      {/* FAQ Accordion & Mobile Button Wrapper */}
      <div className="w-full lg:max-w-[50%] flex flex-col gap-[10px]">

        <div className="flex flex-col gap-[10px]">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                onClick={() => toggleFaq(faq.id)}
                className={`
                  w-full
                  bg-white
                  rounded-[15px]
                  px-[30px]
                  py-[23px]
                  cursor-pointer
                  overflow-hidden
                  transition-opacity
                  duration-500
                  ease-in-out
                  ${isOpen
                    ? 'opacity-100 shadow-sm'
                    : 'opacity-[0.7] hover:opacity-100'
                  }
                `}
              >

                {/* Question + Icon */}
                <div className="flex items-center justify-between gap-4">

                  <h3 className="text-caps-18-smbld text-[#1b1b1b] uppercase tracking-wide">
                    {faq.question}
                  </h3>

                  <div className="flex-shrink-0 w-[37px] h-[37px] relative flex items-center justify-center">

                    <Image
                      src={
                        isOpen
                          ? '/icons/faq-x.svg'
                          : '/icons/faq-plus.svg'
                      }
                      alt={isOpen ? 'Close' : 'Open'}
                      width={37}
                      height={37}
                      className="w-[37px] h-[37px] transition-transform duration-500 ease-in-out"
                    />

                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`
                    grid
                    transition-all
                    duration-500
                    ease-in-out
                    ${isOpen
                      ? 'grid-rows-[1fr] opacity-100 mt-[18px]'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pt-0'
                    }
                  `}
                >
                  <div className="overflow-hidden">

                    <p className="text-base lg:max-w-[611px] text-gray-600 font-normal normal-case leading-relaxed">
                      {faq.answer}
                    </p>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Mobile Button (Visible only on screens below LG) */}
        <div className="block lg:hidden mt-[20px]">
           <Button asChild variant="default" className="w-[344px]">
              <Link href="/">START YOUR FREE TRIAL</Link>
            </Button>
        </div>

      </div>

    </section>
  );
}