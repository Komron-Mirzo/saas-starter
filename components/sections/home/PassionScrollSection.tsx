"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP_SCROLL_LENGTH_VH = 12;
const MOBILE_SCROLL_LENGTH_VH = 18;

export default function PassionScrollSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const bgDotRef = useRef<HTMLImageElement>(null);
  const steffyRef = useRef<HTMLImageElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const bubble1Ref = useRef<HTMLImageElement>(null);
  const bubble2Ref = useRef<HTMLImageElement>(null);
  const bubble3Ref = useRef<HTMLImageElement>(null);
  const bubble4Ref = useRef<HTMLImageElement>(null);
  const bubble5Ref = useRef<HTMLImageElement>(null);

  const certWrapDesktopRef = useRef<HTMLDivElement>(null);
  const certWrapMobileRef = useRef<HTMLDivElement>(null);

  const halfCircleRef = useRef<HTMLDivElement>(null);

  // ---- Scroll-pinned timelines (one per breakpoint) -----------------------
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    // ============================ DESKTOP =================================
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(bgDotRef.current, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
        gsap.set(steffyRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
        gsap.set(circleRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
        gsap.set(
          [bubble1Ref.current, bubble2Ref.current, bubble3Ref.current, bubble4Ref.current, bubble5Ref.current],
          { scale: 0, transformOrigin: "50% 50%" }
        );
        gsap.set(certWrapDesktopRef.current, { xPercent: -50, yPercent: 120 });
        // Desktop: hide below viewport. Height is 50vw of 110vw width element.
        gsap.set(halfCircleRef.current, { xPercent: -50, y: window.innerHeight });

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "passion-scroll-section-desktop",
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * DESKTOP_SCROLL_LENGTH_VH}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(steffyRef.current, { scale: 1, duration: 2, ease: "power2.out" }, 0);

        tl.to(bgDotRef.current, { scale: 0, opacity: 0, duration: 2, ease: "power2.inOut" }, 2);
        tl.to(circleRef.current, { scale: 1, duration: 2, ease: "power2.out" }, 2);

        tl.to(bubble1Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 4);
        tl.to(bubble2Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 6);
        tl.to(bubble3Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 8);

        tl.to(
          [bubble1Ref.current, bubble2Ref.current, bubble3Ref.current],
          { scale: 0, duration: 1, ease: "power2.in" },
          12
        );
        tl.to(circleRef.current, { y: "-120vh", opacity: 0, duration: 1.5, ease: "power2.in" }, 13);

        tl.to(bubble4Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 16.5);

        tl.to(certWrapDesktopRef.current, { yPercent: -260, duration: 3, ease: "none" }, 18.5);
        tl.to(bubble4Ref.current, { scale: 0, duration: 1, ease: "power2.in" }, 20.5);

        tl.to(bubble5Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 24);

        // Animate half circle up from below. Target y so top of half circle
        // sits at 50% of viewport (fills bottom half of screen).
        // Height = 110vw * 0.5 = 55vw. We want bottom edge at viewport bottom,
        // so y = innerHeight - halfCircleHeight.
        tl.to(halfCircleRef.current, {
          y: () => window.innerHeight - window.innerWidth * 1.1 * 0.5,
          duration: 5.5,
          ease: "power2.inOut",
        }, 28.5);

        tl.to(steffyRef.current, { y: "-85vh", duration: 5.5, ease: "power2.in" }, 28.5);
        tl.to(bubble5Ref.current, { y: "-20vh", opacity: 0, scale: 0.6, duration: 2, ease: "power2.in" }, 28.5);
      }, rootRef);

      return () => ctx.revert();
    });

    // ============================= MOBILE ==================================
    mm.add("(max-width: 767.98px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(bgDotRef.current, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
        gsap.set(steffyRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
        gsap.set(circleRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
        gsap.set(
          [bubble1Ref.current, bubble2Ref.current, bubble3Ref.current, bubble4Ref.current, bubble5Ref.current],
          { scale: 0, transformOrigin: "50% 50%" }
        );
        gsap.set(certWrapMobileRef.current, { opacity: 0, y: 40 });
        // Mobile: hide below viewport. Height = 110vw * 0.5 = 55vw.
        gsap.set(halfCircleRef.current, { xPercent: -50, y: window.innerHeight });

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "passion-scroll-section-mobile",
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * MOBILE_SCROLL_LENGTH_VH}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(steffyRef.current, { scale: 1, duration: 2, ease: "power2.out" }, 0);

        tl.to(bgDotRef.current, { scale: 0, opacity: 0, duration: 2, ease: "power2.inOut" }, 2);
        tl.to(circleRef.current, { scale: 1, duration: 2, ease: "power2.out" }, 2);

        tl.to(bubble1Ref.current, { scale: 1, duration: 1, ease: "back.out(1.5)" }, 4);
        tl.to(bubble1Ref.current, { scale: 0, duration: 1, ease: "power2.in" }, 7);

        tl.to(bubble2Ref.current, { scale: 1, duration: 1, ease: "back.out(1.5)" }, 10);
        tl.to(bubble2Ref.current, { scale: 0, duration: 1, ease: "power2.in" }, 13);
        tl.to(circleRef.current, { y: "-50vh", scale: 0, opacity: 0, duration: 1.5, ease: "power2.in" }, 13);

        tl.to(bubble3Ref.current, { scale: 1, duration: 1, ease: "back.out(1.5)" }, 16);
        tl.to(bubble3Ref.current, { scale: 0, duration: 1, ease: "power2.in" }, 19);

        tl.to(bubble4Ref.current, { scale: 1, duration: 1, ease: "back.out(1.5)" }, 22);
        tl.to(certWrapMobileRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 22);
        tl.to(bubble4Ref.current, { scale: 0, duration: 1, ease: "power2.in" }, 25);
        tl.to(certWrapMobileRef.current, { opacity: 0, y: 30, duration: 1, ease: "power2.in" }, 25);

        tl.to(bubble5Ref.current, { scale: 1, duration: 1, ease: "back.out(1.5)" }, 28);

        // Animate half circle up. Height = 110vw * 0.5.
        // y target = innerHeight - halfCircleHeight so bottom sits flush with viewport bottom.
        tl.to(halfCircleRef.current, {
          y: () => window.innerHeight - window.innerWidth * 1.1 * 0.5, // 80vw height
          duration: 3,
          ease: "power2.inOut",
        }, 31);



        tl.to(steffyRef.current, { y: "-40vh", opacity: 0, duration: 3, ease: "power2.in" }, 31);
        tl.to(bubble5Ref.current, { y: "-15vh", opacity: 0, scale: 0.6, duration: 2, ease: "power2.in" }, 31);
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
    <div id="about-steffi" className="relative -top-24 h-0 w-0 pointer-events-none" />
    <div ref={rootRef} className="relative w-full bg-[#f3f3f3]">
      <style>{`
        @keyframes cert-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cert-infinite-track {
          animation: cert-scroll 8s linear infinite;
          will-change: transform;
        }
        .cert-infinite-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* I) Static top part — outside the pin/scrub */}
      <div className="flex flex-col items-center justify-center gap-[16px] px-4 pb-10 pt-14 text-center md:gap-[25px] md:pb-16 md:pt-20 md:max-w-[1870px] md:m-auto">
        <span className="text-caps-14-smbld rounded-full bg-white px-[12px] py-[4px]">
          ABOUT STEFFI
        </span>
        <img src="/images/passion-top-heading.svg" alt="From passion to power" className="w-full z-1" />
      </div>

      {/* II) Pinned, scroll-scrubbed stage */}
      <div
        ref={pinRef}
        className="relative h-screen w-full flex items-center justify-center"
      >
        {/*
          True half circle: width 110vw, height = 55vw (half of width),
          border-radius curves only the top edge.
          Starts hidden below viewport via GSAP y: window.innerHeight.
          -translate-x-1/2 is handled by GSAP xPercent: -50.
        */}
        <div
          ref={halfCircleRef}
          id="story-worlds"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 bg-[#FF7DA8] z-0 w-[110vw] h-[55vw] md:h-[55vw] min-[2200px]:-bottom-[13vw] min-[1920px]:-bottom-[10vw] min-[1800px]:-bottom-[20vw] max-[1024px]:bottom-[35vw] max-[900px]:bottom-[48vw] max-[806px]:bottom-[60vw] max-[768px]:bottom-[50vw] max-[725px]:bottom-[70vw] max-[630px]:bottom-[90vw] max-[560px]:bottom-[100vw] max-[535px]:bottom-[118vw] max-[480px]:bottom-[135vw] max-[450px]:bottom-[150vw] max-[410px]:bottom-[170vw] max-[380px]:bottom-[188vw] max-[350px]:bottom-[200vw] max-[335px]:bottom-[700px]"
          style={{
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          }}
        />

        <div
          ref={stageRef}
          className="relative mx-auto w-full h-full max-h-[85vh] md:max-w-[1650px] md:max-h-[885px] max-[768px]:max-w-full"
        >
          {/* bg dot pattern */}
          <img
            ref={bgDotRef}
            src="/images/passion-bg-dot.svg"
            alt=""
            className="absolute left-1/2 top-[38%] w-[90vw] max-w-[90vw] z-0 md:top-1/2 md:w-full md:max-w-[1257px] md:!z-0 md:max-h-[95vh] md:max-[1024px]:max-h-[80vh]"
          />

          {/* teal circle behind Steffy */}
          <div
            ref={circleRef}
            className="absolute left-1/2 top-[38%] h-[85vw] w-[85vw] max-h-[340px] max-w-[340px] rounded-full bg-[#30D5C8] md:top-1/2 md:h-[846px] md:w-[846px] md:max-h-[95vh] md:max-w-[95vh] md:max-[1024px]:max-h-[80vh] md:max-[1024px]:max-w-[80vh]"
          />

          {/* Steffy */}
          <img
            ref={steffyRef}
            src="/images/passion-steffy.svg"
            alt="Steffi"
            className="absolute left-1/2 top-[38%] z-10 w-[70vw] max-w-[320px] md:top-1/2 md:w-full md:max-w-[522px] md:max-h-[95vh] md:max-[1024px]:max-h-[80vh]"
          />

          {/* bubble 01 */}
          <img
            ref={bubble1Ref}
            src="/images/passion-bubble-01.svg"
            alt=""
            className="absolute left-[6%] top-[24%] z-20 w-[60vw] max-w-[260px] md:z-auto md:left-auto md:right-[120px] md:max-[1024px]:right-[10vw] md:top-[54px] md:max-w-[581px] md:w-[30vw] max-[768px]:right-[20px] max-[768px]:left-auto"
          />

          {/* bubble 02 */}
          <img
            ref={bubble2Ref}
            src="/images/passion-bubble-02.svg"
            alt=""
            className="absolute bottom-[6%] z-20 w-[95vw] max-w-[340px] md:z-auto md:left-[50px] md:translate-x-0 md:top-[131px] md:bottom-auto md:max-w-[491px] md:max-[1024px]:left-[5vw] md:max-[1024px]:top-[7vw] md:w-[26vw] md:max-[1200px]:w-[33vw] md:max-[1024px]:w-[45vw] max-[768px]:right-auto max-[768px]:left-[220px] max-[500px]:left-[20px]"
          />

          {/* bubble 03 */}
          <img
            ref={bubble3Ref}
            src="/images/passion-bubble-03.svg"
            alt=""
            className="absolute right-[20%] bottom-[25%] z-20 w-[80vw] max-w-[260px] md:right-auto md:bottom-[110px] md:left-[210px] md:w-[25vw] md:max-w-[472px] md:z-10 md:max-[1024px]:w-[40vw] md:max-[1024px]:left-[15vw] md:max-[1024px]:bottom-[10vw]"
          />

          {/* bubble 04 */}
          <img
            ref={bubble4Ref}
            src="/images/passion-bubble-04.svg"
            alt=""
            className="absolute left-1/2 -translate-x-1/2 top-[30%] z-20 w-[70vw] max-w-[300px] md:z-auto md:left-[50px] md:translate-x-0 md:top-[132px] md:w-[38vw] md:max-w-[721px]"
          />

          {/* bubble 05 */}
          <img
            ref={bubble5Ref}
            src="/images/passion-bubble-05.svg"
            alt=""
            className="absolute left-1/2 -translate-x-1/2 top-[30%] z-20 w-[62vw] max-w-[260px] md:left-auto md:translate-x-0 md:right-[130px] md:top-[233px] md:z-10 md:w-[26vw] md:max-w-[500px] max-[768px]:right-[20px] max-[768px]:left-auto max-[768px]:right-[20px] max-[768px]:!-right-[125px]"
          />

          {/* certificates — desktop: vertical strip that travels bottom -> top */}
          <div
            ref={certWrapDesktopRef}
            className="hidden md:flex absolute -right-[200px] max-[1500px]:-right-[11vw] top-1/2 max-w-[581px] max-[1500px]:w-[30vw] flex-col gap-[87px]"
          >
            <img src="/images/passion-certificate-01.svg" alt="Certificate of Achievement" className="max-w-[379px] w-[20vw] self-end" />
            <img src="/images/passion-certificate-02.svg" alt="Certified Nutritionist" className="max-w-[379px] w-[20vw] self-start" />
            <img src="/images/passion-certificate-03.svg" alt="Certificate of Completion" className="max-w-[379px] w-[20vw] self-end" />
          </div>

          {/* certificates — mobile: pure-CSS infinite auto-scroll loop */}
          <div
            ref={certWrapMobileRef}
            className="flex md:hidden absolute bottom-[4%] left-0 right-0 z-20"
            style={{ overflow: "hidden" }}
          >
            <div
              className="cert-infinite-track flex gap-4 px-4"
              style={{ width: "max-content" }}
            >
              {/* Set 1 */}
              <img src="/images/passion-certificate-01.svg" alt="Certificate of Achievement" className="w-[60vw] max-w-[220px] flex-shrink-0" draggable={false} />
              <img src="/images/passion-certificate-02.svg" alt="Certified Nutritionist" className="w-[60vw] max-w-[220px] flex-shrink-0" draggable={false} />
              <img src="/images/passion-certificate-03.svg" alt="Certificate of Completion" className="w-[60vw] max-w-[220px] flex-shrink-0" draggable={false} />
              {/* Set 2 — duplicate for seamless loop */}
              <img src="/images/passion-certificate-01.svg" alt="" aria-hidden="true" className="w-[60vw] max-w-[220px] flex-shrink-0" draggable={false} />
              <img src="/images/passion-certificate-02.svg" alt="" aria-hidden="true" className="w-[60vw] max-w-[220px] flex-shrink-0" draggable={false} />
              <img src="/images/passion-certificate-03.svg" alt="" aria-hidden="true" className="w-[60vw] max-w-[220px] flex-shrink-0" draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}