'use client';

import React, { forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

const BOOK_WIDTH = 904;   // full spread, max
const BOOK_HEIGHT = 640;  // max
const MIN_WIDTH = typeof window !== 'undefined' && window.innerWidth < 500 ? 100 : 220;
const MIN_HEIGHT = Math.round(MIN_WIDTH * (BOOK_HEIGHT / (BOOK_WIDTH / 2)));

const Page = forwardRef<HTMLDivElement, { pageNumber: number; imageUrl: string }>(
  ({ pageNumber, imageUrl }, ref) => {
    return (
      <div className="bg-white overflow-hidden h-full w-full flex items-center justify-center rounded-none m-0 p-0" ref={ref}>
        <img
          src={imageUrl}
          alt={`Comic page ${pageNumber}`}
          className="w-full h-full object-fill select-none"
          draggable={false}
        />
      </div>
    );
  }
);
Page.displayName = 'Page';

export default function BookReaderFlipBook() {
  const bookRef = useRef<React.ElementRef<typeof HTMLFlipBook>>(null);

  const pages = [
    { id: 1, img: '/flipbook/1.jpg' },
    { id: 2, img: '/flipbook/2.jpg' },
    { id: 3, img: '/flipbook/3.jpg' },
    { id: 4, img: '/flipbook/4.jpg' },
    { id: 5, img: '/flipbook/5.jpg' },
    { id: 6, img: '/flipbook/6.jpg' },
    { id: 7, img: '/flipbook/7.jpg' },
    { id: 8, img: '/flipbook/8.jpg' },
  ];

  const handlePrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const handleNext = () => bookRef.current?.pageFlip()?.flipNext();

  return (
    <div className="w-full min-w-0 flex flex-col items-center justify-center">

      <div className="w-full max-w-[904px] flex justify-end gap-[10px] mb-[24px] max-[1024px]:order-last max-[1024px]:justify-center max-[1024px]:mb-[0] max-[1024px]:mt-[25px]">
        <button
          onClick={handlePrev}
          className="size-[55px] rounded-full bg-white text-[#1b1b1b] hover:bg-neutral-100 flex items-center justify-center font-bold text-xl shadow-md transition-all cursor-pointer"
          aria-label="Previous page"
        >
          &larr;
        </button>
        <button
          onClick={handleNext}
          className="size-[55px] rounded-full bg-white text-[#1b1b1b] hover:bg-neutral-100 flex items-center justify-center font-bold text-xl shadow-md transition-all cursor-pointer"
          aria-label="Next page"
        >
          &rarr;
        </button>
      </div>

      {/*
        No manual scale/transform math needed. size="stretch" lets the library's
        own ResizeObserver fit the book to this container's width, bounded by
        min/maxWidth + min/maxHeight. Parent just needs a real width to shrink to.
      */}
      <div className="w-full min-w-0" style={{ maxWidth: `${BOOK_WIDTH}px` }}>
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          size="stretch"
          width={BOOK_WIDTH / 2}
          height={BOOK_HEIGHT}
          minWidth={MIN_WIDTH}
          maxWidth={BOOK_WIDTH / 2}
          minHeight={MIN_HEIGHT}
          maxHeight={BOOK_HEIGHT}
          maxShadowOpacity={0.4}
          showCover={false}
          usePortrait={false}
          mobileScrollSupport={true}
          className="shadow-2xl mx-auto !w-full"
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          autoSize={true}
          startZIndex={0}
          swipeDistance={30}
          clickEventForward={true}
          useMouseEvents={true}
          renderOnlyPageLengthChange={false}
          disableFlipByClick={false}
          showPageCorners={true}
        >
          {pages.map((page, index) => (
            <Page key={page.id} pageNumber={index + 1} imageUrl={page.img} />
          ))}
        </HTMLFlipBook>
      </div>

    </div>
  );
}