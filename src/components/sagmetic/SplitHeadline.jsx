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
    if (!root || !splashDone) return;

    let ctx;
    let splitLine1;
    let splitLine2;
    let splitSerif;
    let cancelled = false;

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
          { x: -24 },
          {
            x: 0,
            duration: 0.65,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );

        if (allChars.length > 0) {
          gsap.fromTo(
            allChars,
            {
              y: (idx) => (idx % 2 === 0 ? -18 : 18),
            },
            {
              y: 0,
              duration: 0.6,
              delay: 0.04,
              stagger: { each: 0.02, from: 'start' },
              ease: 'power3.out',
              clearProps: 'transform',
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

  return (
    <h1
      ref={headingRef}
      className="overflow-visible font-futura-headline font-extrabold text-white text-[56px] leading-[54px] sm:text-[104px] sm:leading-[96px] lg:text-[166px] lg:leading-[148px]"
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
        className="inline-block font-instrument-serif italic font-normal text-[#DE2D26] text-[56px] leading-[54px] sm:text-[104px] sm:leading-[96px] lg:text-[166px] lg:leading-[148px] will-change-transform"
      >
        Agency
      </span>
    </h1>
  );
}