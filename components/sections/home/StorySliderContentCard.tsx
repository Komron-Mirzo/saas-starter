'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { StorySliderWithGains } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WaitlistTriggerButton } from '@/components/ui/joinlist-trigger-button';

interface StorySliderContentCardProps {
  slide: StorySliderWithGains;
}

export default function StorySliderContentCard({ slide }: StorySliderContentCardProps) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      
    >
      {/* Background Image */}
      <div className="absolute inset-0" >
        <Image
          src={slide.backgroundImageUrl}
          alt={slide.title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        />
      </div>

      {/* Inner layout: padding 67px 155px */}
      <div
        className="relative z-10 flex items-center justify-between max-[1024px]:flex-col max-[1024px]:items-start w-full h-full max-w-[1600px] m-auto px-[20px] py-[67px] max-[1024px]:py-[20px]"
      >
        {/* ── LEFT CONTENT CARD ── */}
        <div
          className="bg-white flex flex-col p-[45px] max-[1024px]:px-[25px] max-[1024px]:py-[35px] w-[510px] max-[1024px]:w-full max-[1024px]:max-w-[690px]"
          style={{
            minHeight: 'fitContent',
            borderRadius: '60px',
            flexShrink: 0,
          }}
        >
          {/* a) Title */}
          <h4
            className="text-h4-02"
            style={{
              fontStyle: 'italic',
              textTransform: 'uppercase',
              marginBottom: '15px',
            }}
          >
            {slide.title}
          </h4>

          {/* b) Content Text */}
          <p
            className="text-body-16"
            style={{ color: 'rgba(26, 26, 26, 0.8)', marginBottom: '23px' }}
          >
            {slide.contentText}
          </p>

          {/* c) TONE section */}
          <div
            className="flex flex-col"
            style={{ gap: '10px', marginBottom: '23px' }}
          >
            {/* c-1 Label */}
            <div>
              <span
                className="text-caps-18-smbld"
                style={{
                  textTransform: 'uppercase',
                  background: '#f3f3f3',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  display: 'inline-block',
                }}
              >
                Tone:
              </span>
            </div>
            {/* c-2 Text */}
            <p
              className="text-body-16"
              style={{ color: 'rgba(26, 26, 26, 0.8)' }}
            >
              {slide.toneText}
            </p>
          </div>

          {/* d) GOAL section */}
          <div
            className="flex flex-col"
            style={{ gap: '10px', marginBottom: '23px' }}
          >
            {/* d-1 Label */}
            <div>
              <span
                className="text-caps-18-smbld"
                style={{
                  textTransform: 'uppercase',
                  background: '#f3f3f3',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  display: 'inline-block',
                }}
              >
                Goal:
              </span>
            </div>
            {/* d-2 Text */}
            <p
              className="text-body-16"
              style={{ color: 'rgba(26, 26, 26, 0.8)' }}
            >
              {slide.goalText}
            </p>
          </div>

          {/* e) GAINS section */}
          <div
            className="flex flex-col gap-[10px] mb-[35px] max-[1024px]:mb-[20px]"
          >
            {/* e-1 Label */}
            <div>
              <span
                className="text-caps-18-smbld"
                style={{
                  textTransform: 'uppercase',
                  background: '#f3f3f3',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  display: 'inline-block',
                }}
              >
                What you&apos;ll gain:
              </span>
            </div>

            {/* e-2 Gains list */}
            <div className="flex flex-col max-[1024px]:flex-row" style={{ gap: '8px' }}>
              {slide.gains
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((gain) => (
                  <div key={gain.id} className="flex items-center">
                    {/* icon */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        marginRight: '5px',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={gain.iconUrl}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    {/* text */}
                    <p
                      className="text-body-16 max-[1024px]:!text-[14px]"
                      style={{ color: 'rgba(26, 26, 26, 0.8)' }}
                    >
                      {gain.text}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-auto">
             <WaitlistTriggerButton variant="secondary" className="max-[1024px]:!h-[60px] w-[200px]">
              I'M IN
            </WaitlistTriggerButton>
          </div>
        </div>

        {/* ── RIGHT: Category watermark ── */}
        <div className="flex-1 flex items-end justify-end h-full">
          <h2
            className="text-h2-01 text-white"
            style={{ textAlign: 'right', lineHeight: 1 }}
          >
            {slide.categoryText}
          </h2>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * MOBILE (≤767px) CARD — new, does not affect the desktop card above.
 * Collapsed:  B-1 badge + B-2 title + B-3 content text + Read More toggle.
 * Expanded:   + Tone + Goal + Gains + Read Less toggle + CTA.
 * ──────────────────────────────────────────────────────────────────────── */
interface StorySliderContentCardMobileProps {
  slide: StorySliderWithGains;
}

export function StorySliderContentCardMobile({ slide }: StorySliderContentCardMobileProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white flex flex-col flex-shrink-0 max-w-[344px] min-h-[585px] rounded-[40px] overflow-hidden"
    >
      {/* ── LEFT: featured image ── */}
      <div className="flex-shrink-0 h-[219px] w-full p-[10px]">
        {/* NOTE: image column width wasn't specified in the spec — using 130px */}
        <div
          className="relative overflow-hidden w-full h-[208px] rounded-[30px]"
        >
          <Image
            src={slide.backgroundImageUrl}
            alt={slide.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* ── RIGHT: content ── */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ padding: '25px 25px 35px 25px' }}
      >
        {/* B-1: category badge */}
        <div style={{ marginBottom: '12px' }}>
          <span
            className="text-h6-02 text-white inline-block"
            style={{
              fontStyle: 'italic',
              textTransform: 'uppercase',
              padding: '4px 7px',
              borderRadius: '9999px',
              background: '#FF7DA8',
            }}
          >
            {slide.categoryText}
          </span>
        </div>

        {/* B-2: Title */}
        <h4
          className="text-h4-02"
          style={{ fontStyle: 'italic', textTransform: 'uppercase', marginBottom: '15px' }}
        >
          {slide.title}
        </h4>

        {/* B-3: Content Text */}
        <p
          className="text-body-16"
          style={{ color: 'rgba(26, 26, 26, 0.8)' }}
        >
          {slide.contentText}
        </p>

        {/* Expanded-only: B-4, B-5, B-6 */}
        {expanded && (
          <>
            {/* B-4: TONE */}
            <div className="flex flex-col" style={{ gap: '10px', marginTop: '23px', marginBottom: '23px' }}>
              <div>
                <span
                  className="text-caps-18-smbld"
                  style={{ textTransform: 'uppercase', background: '#f3f3f3', borderRadius: '9999px', padding: '4px 12px', display: 'inline-block' }}
                >
                  Tone:
                </span>
              </div>
              <p className="text-body-16" style={{ color: 'rgba(26, 26, 26, 0.8)' }}>
                {slide.toneText}
              </p>
            </div>

            {/* B-5: GOAL */}
            <div className="flex flex-col" style={{ gap: '10px', marginBottom: '23px' }}>
              <div>
                <span
                  className="text-caps-18-smbld"
                  style={{ textTransform: 'uppercase', background: '#f3f3f3', borderRadius: '9999px', padding: '4px 12px', display: 'inline-block' }}
                >
                  Goal:
                </span>
              </div>
              <p className="text-body-16" style={{ color: 'rgba(26, 26, 26, 0.8)' }}>
                {slide.goalText}
              </p>
            </div>

            {/* B-6: GAINS */}
            <div className="flex flex-col" style={{ gap: '10px', marginBottom: '35px' }}>
              <div>
                <span
                  className="text-caps-18-smbld"
                  style={{ textTransform: 'uppercase', background: '#f3f3f3', borderRadius: '9999px', padding: '4px 12px', display: 'inline-block' }}
                >
                  What you&apos;ll gain:
                </span>
              </div>
              <div className="flex flex-col" style={{ gap: '8px' }}>
                {slide.gains
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((gain) => (
                    <div key={gain.id} className="flex items-center">
                      <div style={{ width: '30px', height: '30px', marginRight: '5px', flexShrink: 0, position: 'relative' }}>
                        <Image src={gain.iconUrl} alt="" fill className="object-contain" />
                      </div>
                      <p className="text-body-16" style={{ color: 'rgba(26, 26, 26, 0.8)' }}>
                        {gain.text}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* B-7: Read More / Read Less toggle — always visible */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-caps-14-smbld text-[#30D5C8] text-left w-fit"
          style={{ marginTop: expanded ? 0 : '15px', marginBottom: '20px' }}
        >
          {expanded ? 'READ LESS' : 'READ MORE'}
        </button>

        {/* B-8: CTA — only in expanded state */}
       
          <div className="mt-auto">
             <WaitlistTriggerButton variant="secondary" className="w-full">
              I'M IN
              </WaitlistTriggerButton>            
          </div>
        
      </div>
    </div>
  );
}