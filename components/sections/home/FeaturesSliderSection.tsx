'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FeatureSliderCard, Feature } from './FeatureSliderCard';
import type { EmblaCarouselType } from 'embla-carousel';

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);

interface Props {
  features: (Feature & { icon: string })[];
}

export default function FeaturesClientCarousel({ features }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla-tween-target') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((api: EmblaCarouselType, eventName?: string) => {
    // Disable JS scaling on mobile viewports (768px and below) so all cards stay uniform
    if (window.innerWidth <= 768) {
      tweenNodes.current.forEach((node) => {
        if (node) {
          node.style.transform = 'scale(1)';
          node.style.opacity = '1';
        }
      });
      return;
    }

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0.718, 1);
        const opacity = numberWithinRange(tweenValue, 0.55, 1);
        const node = tweenNodes.current[slideIndex];
        if (node) {
          node.style.transform = `scale(${scale})`;
          node.style.opacity = String(opacity);
        }
      });
    });
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
    onSelect(emblaApi);

    const handleResize = () => tweenScale(emblaApi);
    window.addEventListener('resize', handleResize);

    emblaApi
      .on('select', onSelect)
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('reInit', onSelect)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale);

    return () => {
      window.removeEventListener('resize', handleResize);
      emblaApi
        .off('select', onSelect)
        .off('reInit', setTweenNodes)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenScale)
        .off('reInit', onSelect)
        .off('scroll', tweenScale)
        .off('slideFocus', tweenScale);
    };
  }, [emblaApi, onSelect, setTweenNodes, setTweenFactor, tweenScale]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section id="features" className="w-full bg-[#FF7DA8] lg:py-[155px] py-[120px]">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-h1-02 text-white text-center mb-[40px] px-[20px] max-[767px]:!text-[32px]">
          WHAT YOU&apos;LL GET:
        </h2>

        {/* Top Thumbnail Navigation Pills (Hidden on 768px and below) */}
        <div className="hidden min-[769px]:flex flex-wrap items-center justify-center gap-[15px] max-[800px]:gap-[9px] mb-8">
          {features.map((feature, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={feature.id}
                onClick={() => scrollTo(index)}
                className={`flex flex-col items-center justify-center transition-all duration-200 
                  /* Desktop (> 1350px) */
                  w-[173px] h-[124px] p-[17px] rounded-[25px] gap-[6px]
                  /* Mid screen (769px to 1350px) */
                  max-[1350px]:w-[98px] max-[1350px]:h-[70px] max-[1350px]:p-[10px] max-[1350px]:rounded-[14px] max-[1350px]:gap-[4px]
                  ${
                    isSelected
                      ? 'bg-white text-[#1b1b1b] shadow-lg'
                      : 'bg-white/25 text-white hover:bg-white/35'
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center gap-inherit w-full h-full">
                  {feature.icon.startsWith('http') ? (
                    <img
                      src={feature.icon}
                      alt=""
                      className={`max-[1350px]:w-[17px] max-[1350px]:h-[17px] max-[1350px]:mb-[4px] w-[30px] h-[30px] object-contain transition-all ${
                        isSelected ? '' : 'brightness-0 invert'
                      }`}
                    />
                  ) : (
                    <span className="max-[1350px]:text-[8px] text-caps-14-smbld">{feature.icon}</span>
                  )}
                  <span className="max-[1350px]:!text-[8px] leading-tight text-center text-caps-14-smbld">
                    {feature.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Full-Width Carousel Wrapper with Responsive Gap-Centered Arrows */}
        <div className="relative w-full mx-auto flex items-center justify-center">
          
          {/* Previous Arrow */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-[calc(50%-clamp(300px,32vw,665.5px))] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 hidden min-[769px]:flex items-center justify-center text-white hover:scale-110 transition-transform"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="30" fill="none" viewBox="0 0 19 30">
              <path fill="#fff" fillOpacity=".7" d="m14.768 0 3.535 3.535L7.07 14.768 18.303 26l-3.535 3.535L0 14.768z"/>
            </svg>
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full" ref={emblaRef}>
            <div className="flex -ml-[15px] items-center py-6">
              {features.map((feature: any) => (
                <div 
                  key={feature.id} 
                  className="flex-[0_0_calc(344px+15px)] md:flex-[0_0_clamp(500px,53.9vw,1035px)] pl-[15px] min-w-0 transition-all max-[400px]:flex-[0_0_calc(300px+15px)]"
                >
                  <div className="embla-tween-target will-change-transform">
                    <FeatureSliderCard feature={feature} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-[calc(50%-clamp(300px,32vw,665.5px))] top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 hidden min-[769px]:flex items-center justify-center text-white hover:scale-110 transition-transform"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="30" fill="none" viewBox="0 0 19 30">
              <path fill="#fff" fillOpacity=".7" d="M3.537 0 .002 3.535l11.232 11.233L.002 26l3.535 3.535 14.768-14.767z"/>
            </svg>
          </button>

        </div>

        {/* Mobile Dots Navigation (Visible only on 768px and below) */}
        <div className="flex min-[769px]:hidden flex-wrap items-center justify-center gap-[9px] mt-6">
          {features.map((feature, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={feature.id}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-200 rounded-full ${
                  isSelected
                    ? 'bg-white shadow-lg w-[10px] h-[10px]'
                    : 'bg-white/25 hover:bg-white/35 w-[6px] h-[6px]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}