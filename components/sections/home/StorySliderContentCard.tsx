'use client';

import Image from 'next/image';
import type { StorySliderWithGains } from '@/lib/db/schema';

interface StorySliderContentCardProps {
  slide: StorySliderWithGains;
}

export default function StorySliderContentCard({ slide }: StorySliderContentCardProps) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ padding: '25px' }}
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
        className="relative z-10 flex items-center justify-between w-full h-full"
        style={{ padding: '67px 155px' }}
      >
        {/* ── LEFT CONTENT CARD ── */}
        <div
          className="bg-white flex flex-col"
          style={{
            width: '510px',
            minHeight: 'fitContent',
            borderRadius: '60px',
            padding: '45px',
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
            className="flex flex-col"
            style={{ gap: '10px', marginBottom: '35px' }}
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
            <div className="flex flex-col" style={{ gap: '8px' }}>
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
                      className="text-body-16"
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
            <button
              className="bg-[#00BFA5] text-white font-bold uppercase tracking-widest"
              style={{
                borderRadius: '9999px',
                padding: '14px 28px',
                fontSize: '13px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Start Your Story
            </button>
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