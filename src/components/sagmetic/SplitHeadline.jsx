import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export default function SplitHeadline({ agencyRef, splashDone = true }) {
  const headingRef = useRef(null);
  const boldLine1Ref = useRef(null);
  const boldLine2Ref = useRef(null);
  const serifLineRef = useRef(null);

  useEffect(() => {
    const root = headingRef.current;
    if (!root) return;

    const isMobile = window.innerWidth < 1024;
    const canAnimate = isMobile ? true : splashDone;
    if (!canAnimate) return;

    let cancelled = false;
    let ctx;
    let splitLine1;
    let splitLine2;
    let splitSerif;

    const run = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled || !headingRef.current) return;

      ctx = gsap.context(() => {
        splitLine1 = SplitText.create(boldLine1Ref.current, { type: 'chars' });
        splitLine2 = SplitText.create(boldLine2Ref.current, { type: 'chars' });
        splitSerif = SplitText.create(serifLineRef.current, { type: 'chars' });

        const allChars = [
          ...(splitLine1.chars || []),
          ...(splitLine2.chars || []),
          ...(splitSerif.chars || []),
        ];

        gsap.fromTo(
          root,
          { x: -64, opacity: 0, visibility: 'visible' },
          {
            x: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          }
        );

        if (allChars.length > 0) {
          gsap.fromTo(
            allChars,
            {
              y: (idx) => (idx % 2 === 0 ? -36 : 36),
              opacity: 0,
              visibility: 'visible',
            },
            {
              y: 0,
              opacity: 1,
              visibility: 'visible',
              duration: 0.65,
              delay: 0.06,
              stagger: { each: 0.02, from: 'start' },
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
            }
          );
        }
      }, root);
    };

    run();

    return () => {
      cancelled = true;
      splitLine1?.revert();
      splitLine2?.revert();
      splitSerif?.revert();
      ctx?.revert();
    };
  }, [splashDone]);

  const shouldHideBeforeReveal =
    typeof window !== 'undefined' && window.innerWidth >= 1024 && !splashDone;

  return (
    <h1
      ref={headingRef}
      style={{ opacity: shouldHideBeforeReveal ? 0 : undefined }}
      className="overflow-visible font-futura-headline font-extrabold text-white text-[56px] leading-[54px] sm:text-[104px] sm:leading-[96px] lg:text-[92px] lg:leading-[84px] xl:text-[112px] xl:leading-[100px] 2xl:text-[166px] 2xl:leading-[148px]"
    >
      <span ref={boldLine1Ref} className="block">
        AI-Powered
      </span>
      <span ref={boldLine2Ref} className="block">
        Creative
      </span>
      <span
        ref={(node) => {
          serifLineRef.current = node;
          if (agencyRef) agencyRef.current = node;
        }}
        className="inline-block font-instrument-serif italic font-normal text-[#DE2D26] text-[56px] leading-[54px] sm:text-[104px] sm:leading-[96px] lg:text-[92px] lg:leading-[84px] xl:text-[112px] xl:leading-[100px] 2xl:text-[166px] 2xl:leading-[148px] will-change-transform"
      >
        Agency
      </span>
    </h1>
  );
}