"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PassionScrollSection
 * ---------------------------------------------------------------------------
 * "From passion to power" — pinned, scroll-scrubbed story section.
 *
 * Structure:
 *  I)  Static top part (label + heading image) — NOT part of the pin/scrub.
 *  II) Pinned stage — a single ScrollTrigger timeline drives every step
 *      described in the spec. The whole thing is wrapped in gsap.context()
 *      and scoped to this component's root so it can never read/kill
 *      ScrollTriggers created by sibling sections (and vice versa).
 *
 * Ending sequence (per Figma steps 10–12):
 *   - bubble-05 scales in, then holds fixed with Steffy for a couple of
 *     scrolls.
 *   - A REAL semicircle (not a squashed ellipse) rises up from the bottom
 *     edge while Steffy + bubble-05 fade/slide upward and out.
 *   - Once the circle settles, the closing copy fades in, followed by the
 *     "START YOUR JOURNEY" button.
 *   - The pin then releases and normal scroll continues into whatever comes
 *     next in the page.
 * ---------------------------------------------------------------------------
 */

// How many "viewport heights" of scroll the whole pinned story should take.
// Tweak this single number to make the whole sequence feel faster/slower.
const SCROLL_LENGTH_VH = 12;

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

  const certWrapRef = useRef<HTMLDivElement>(null);
  const halfCircleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // ---- Initial states -------------------------------------------------
      gsap.set(bgDotRef.current, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
      gsap.set(steffyRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
      gsap.set(circleRef.current, { xPercent: -50, yPercent: -50, scale: 0 });

      gsap.set(
        [bubble1Ref.current, bubble2Ref.current, bubble3Ref.current, bubble4Ref.current, bubble5Ref.current],
        { scale: 0, transformOrigin: "50% 50%" }
      );

      // Certificates start below the stage, centered horizontally.
      gsap.set(certWrapRef.current, { xPercent: -50, yPercent: 120 });

      // Closing pink semicircle: a full circle whose vertical center sits
      // exactly on the stage's bottom edge (see JSX below), so at rest only
      // its top half is ever visible — a real, mathematically correct
      // semicircle rather than a squashed ellipse. It starts pushed fully
      // below the stage and slides up into that resting position.
      gsap.set(halfCircleRef.current, { xPercent: -50, yPercent: 100 });

      // ---- Master scrubbed timeline ---------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "passion-scroll-section",
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * SCROLL_LENGTH_VH}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Step II-B — Steffy scales in over the dot background (0 -> 2)
      tl.to(steffyRef.current, { scale: 1, duration: 2, ease: "power2.out" }, 0);

      // Step II-C — dot fades/scales out, teal circle scales up behind Steffy (2 -> 4)
      tl.to(bgDotRef.current, { scale: 0, opacity: 0, duration: 2, ease: "power2.inOut" }, 2);
      tl.to(circleRef.current, { scale: 1, duration: 2, ease: "power2.out" }, 2);

      // Step II-D — bubble 01 scales up, right side (4 -> 6)
      tl.to(bubble1Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 4);

      // Step II-E — bubble 02 scales up, top left (6 -> 8)
      tl.to(bubble2Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 6);

      // Step II-F — bubble 03 scales up, bottom left (8 -> 10)
      tl.to(bubble3Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 8);

      // Step II-G — hold everything (10 -> 12), then bubbles scale down,
      // then the teal circle rises out of frame (12 -> 14.5)
      tl.to(
        [bubble1Ref.current, bubble2Ref.current, bubble3Ref.current],
        { scale: 0, duration: 1, ease: "power2.in" },
        12
      );
      tl.to(circleRef.current, { y: "-120vh", opacity: 0, duration: 1.5, ease: "power2.in" }, 13);

      // Step II-H — hold Steffy alone (14.5 -> 16.5), then bubble 04 scales up, left (16.5 -> 18.5)
      tl.to(bubble4Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 16.5);

      // Step II-I — certificates travel bottom -> top and fully exit the top edge (18.5 -> 21.5).
      // Bubble 04 scales back down right as the last certificate passes center.
      tl.to(certWrapRef.current, { yPercent: -260, duration: 3, ease: "none" }, 18.5);
      tl.to(bubble4Ref.current, { scale: 0, duration: 1, ease: "power2.in" }, 20.5);

      // Step II-J — hold Steffy alone (21.5 -> 24), then bubble 05 scales up, right side (24 -> 26)
      tl.to(bubble5Ref.current, { scale: 1, duration: 2, ease: "back.out(1.5)" }, 24);

      // Step II-K — bubble 05 + Steffy stay put, fixed, for a couple of scrolls (26 -> 28.5)
      // (intentionally empty — nothing animates here, it's a hold)

      // Step II-L — the pink semicircle rises from the bottom while, at the same time,
      // Steffy drifts upward and fades out along with bubble 05. (28.5 -> 31.5)
      tl.to(halfCircleRef.current, { yPercent: 0, duration: 3, ease: "power2.inOut" }, 28.5);
      tl.to(steffyRef.current, { y: "-45vh", opacity: 0, duration: 3, ease: "power2.in" }, 28.5);
      tl.to(bubble5Ref.current, { y: "-20vh", opacity: 0, scale: 0.6, duration: 2, ease: "power2.in" }, 28.5);

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full bg-[#F0EFED]">
      {/* ------------------------------------------------------------------ */}
      {/* I) Static top part — outside the scroll animation                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col items-center gap-[25px] px-4 pb-16 pt-20 text-center max-w-[1870px]">
        <span className="text-caps-14-smbld rounded-full bg-white px-[12px] py-[4px]">
          ABOUT STEFFI
        </span>
        <img
          src="/images/passion-top-heading.svg"
          alt="From passion to power"
          className="w-full"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* II) Pinned, scroll-scrubbed stage                                  */}
      {/* ------------------------------------------------------------------ */}
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div
          ref={stageRef}
          className="relative mx-auto h-full w-full "
        >
          {/* II-A: background dot pattern */}
          <img
            ref={bgDotRef}
            src="/images/passion-bg-dot.svg"
            alt=""
            className="absolute left-1/2 top-1/2 w-full max-w-[1257px]"
          />

          {/* II-C: teal circle behind Steffy */}
          <div
            ref={circleRef}
            className="absolute left-1/2 top-1/2 h-[684px] w-[684px] rounded-full bg-[#30D5C8]"
          />

          {/* II-B: Steffy — stays centered & fixed until the closing sequence */}
          <img
            ref={steffyRef}
            src="/images/passion-steffy.svg"
            alt="Steffi"
            className="absolute left-1/2 top-1/2 z-10 w-full max-w-[522px]"
          />

          {/* II-D: bubble 01 — right */}
          <img
            ref={bubble1Ref}
            src="/images/passion-bubble-01.svg"
            alt=""
            className="absolute right-[255px] top-[74px] w-full max-w-[581px]"
          />

          {/* II-E: bubble 02 — top left */}
          <img
            ref={bubble2Ref}
            src="/images/passion-bubble-02.svg"
            alt=""
            className="absolute left-[180px] top-[131px] w-full max-w-[491px]"
          />

          {/* II-F: bubble 03 — bottom left */}
          <img
            ref={bubble3Ref}
            src="/images/passion-bubble-03.svg"
            alt=""
            className="absolute bottom-[132px] left-[349px] w-full max-w-[472px]"
          />

          {/* II-H: bubble 04 — top left, larger */}
          <img
            ref={bubble4Ref}
            src="/images/passion-bubble-04.svg"
            alt=""
            className="absolute left-[180px] top-[132px] w-full max-w-[721px]"
          />

          {/* II-J: bubble 05 — right */}
          <img
            ref={bubble5Ref}
            src="/images/passion-bubble-05.svg"
            alt=""
            className="absolute right-[180px] top-[233px] z-10 w-full max-w-[500px]"
          />

          {/* II-I: certificates — travel bottom -> top, then exit */}
          <div
            ref={certWrapRef}
            className="absolute left-1/2 top-1/2 flex w-[510px] flex-col gap-[87px]"
          >
            <img
              src="/images/passion-certificate-01.svg"
              alt="Certificate of Achievement"
              className="w-[379px] self-end"
            />
            <img
              src="/images/passion-certificate-02.svg"
              alt="Certificate of Completion"
              className="w-[379px] self-start"
            />
            <img
              src="/images/passion-certificate-03.svg"
              alt="Certificate of Completion"
              className="w-[379px] self-end"
            />
          </div>

          {/*
            II-L: closing pink semicircle.
            The element is a full circle (aspect-square) whose diameter is
            wider than the stage so it always bleeds edge-to-edge. It's
            positioned so its vertical CENTER sits exactly on the stage's
            bottom edge (bottom: -50% of its own height) — since the stage
            clips overflow, only the top half is ever visible, which is a
            true, evenly-curved semicircle, not a stretched ellipse.
          */}
          <div
            ref={halfCircleRef}
            className="pointer-events-none absolute left-1/2 aspect-square w-[140%] rounded-full bg-[#FF7DA8]"
            style={{ bottom: "-70%" }}
          />
          
        </div>
      </div>

      {/* Render the next section right after this one in the page. If that
          next section is a static pink CTA identical to the closing frame
          above, you likely don't need to render both — this pinned stage
          already ends on that exact frame. The pin releases automatically
          once the timeline completes, so normal scroll continues straight
          into whatever comes next. */}
    </div>
  );
}