'use client';

import React, { forwardRef, useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';

const BOOK_WIDTH = 904;
const BOOK_HEIGHT = 640;

// Page component wrapper required by react-pageflip
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Dynamically calculate scale factor based on container width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const currentWidth = containerRef.current.offsetWidth;
        // Calculate scale relative to the base BOOK_WIDTH (capping max scale at 1)
        const newScale = Math.min(currentWidth / BOOK_WIDTH, 1);
        setScale(newScale);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const handlePrev = () => {
    const flip = bookRef.current?.pageFlip();
    if (flip) {
      flip.flipPrev();
    }
  };

  const handleNext = () => {
    const flip = bookRef.current?.pageFlip();
    if (flip) {
      flip.flipNext();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">

      {/* Custom Control Arrows matching your Figma design */}
      <div className="w-full max-w-[904px] flex justify-end gap-3 mb-6 px-4">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white text-[#1b1b1b] hover:bg-neutral-100 flex items-center justify-center font-bold text-xl shadow-md transition-all cursor-pointer"
          aria-label="Previous page"
        >
          &larr;
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white text-[#1b1b1b] hover:bg-neutral-100 flex items-center justify-center font-bold text-xl shadow-md transition-all cursor-pointer"
          aria-label="Next page"
        >
          &rarr;
        </button>
      </div>

      {/* Responsive Scaling Container */}
      <div 
        ref={containerRef}
        className="w-full max-w-[904px] flex justify-center items-center overflow-hidden"
        style={{ height: `${BOOK_HEIGHT * scale}px` }}
      >
        <div 
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: `${BOOK_WIDTH}px`,
            height: `${BOOK_HEIGHT}px`,
          }}
          className="flex justify-center items-center transition-transform duration-75 ease-out"
        >
          {/* @ts-ignore */}
          <HTMLFlipBook
            ref={bookRef}
            width={BOOK_WIDTH / 2}
            height={BOOK_HEIGHT}
            size="fixed"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.4}
            showCover={false}
            usePortrait={false}
            mobileScrollSupport={true}
            className="shadow-2xl mx-auto"
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            autoSize={false}
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

    </div>
  );
}