import { useRef, useState } from "react";
import SagmeticHero from "../sagmetic/SagmeticHero";


import AboutSagmeticSection from "../sagmetic/AboutSagmeticSection";
import TechnologyExpertiseSection from "../sagmetic/TechnologyExpertiseSection";
import ExpertiseSpotlightSection from "../sagmetic/ExpertiseSpotlightSection";
import AiSolutionsCaseStudySection from "../sagmetic/AiSolutionsCaseStudySection";
import WhatWeDoSection from "../sagmetic/WhatWeDoSection";
import FeaturedWorkSection from "../sagmetic/FeaturedWorkSection";
import AiWorkflowSection from "../sagmetic/AiWorkflowSection";
import StatsAndCtaSection from "../sagmetic/StatsAndCtaSection";
import FaqSection from "../sagmetic/FaqSection";
import ContactAndFooterSection from "../sagmetic/ContactAndFooterSection";

import FloatingMascotDock from "../sagmetic/FloatingMascotDock"

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const footerRef = useRef(null);

  return (
    <>
      <FloatingMascotDock
        footerRef={footerRef}
        onSplashComplete={() => setSplashDone(true)}
      />

      <SagmeticHero splashDone={splashDone} />
      <AboutSagmeticSection />
      <TechnologyExpertiseSection />
      <ExpertiseSpotlightSection />
      <AiSolutionsCaseStudySection />
      <WhatWeDoSection />
      <FeaturedWorkSection />
      <AiWorkflowSection />
      <StatsAndCtaSection />
      <FaqSection />
      <ContactAndFooterSection />
    </>
  );
}