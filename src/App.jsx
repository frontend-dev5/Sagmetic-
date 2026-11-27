
import './App.css'
import { useRef, useState } from 'react'
import SagmeticHero from './components/sagmetic/SagmeticHero'
import AboutSagmeticSection from './components/sagmetic/AboutSagmeticSection'
import TechnologyExpertiseSection from './components/sagmetic/TechnologyExpertiseSection'
import ExpertiseSpotlightSection from './components/sagmetic/ExpertiseSpotlightSection'
import AiSolutionsCaseStudySection from './components/sagmetic/AiSolutionsCaseStudySection'
import WhatWeDoSection from './components/sagmetic/WhatWeDoSection'
import FeaturedWorkSection from './components/sagmetic/FeaturedWorkSection'
import AiWorkflowSection from './components/sagmetic/AiWorkflowSection'
import StatsAndCtaSection from './components/sagmetic/StatsAndCtaSection'
import FaqSection from './components/sagmetic/FaqSection'
import ContactAndFooterSection from './components/sagmetic/ContactAndFooterSection'
import FloatingMascotDock from './components/sagmetic/FloatingMascotDock'


export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const footerRef = useRef(null);

  return (
    // <div className="min-h-screen w-full flex flex-col bg-slate-950 text-white">
    //   <div className="p-4 flex gap-3 z-10">
    //     <button
    //       type="button"
    //       onClick={() => setActive('shiba')}
    //       className={`px-4 py-2 rounded ${active === 'shiba' ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}
    //     >
    //       Shiba Mascot
    //     </button>
    //     <button
    //       type="button"
    //       onClick={() => setActive('robot')}
    //       className={`px-4 py-2 rounded ${active === 'robot' ? 'bg-emerald-400 text-black' : 'bg-slate-800'}`}
    //     >
    //       Robot Mascot
    //     </button>
    //   </div>

    //   <div className="flex-1 w-full">
    //     {active === 'shiba' ? (
    //       <ShibaMascot className="w-full h-[calc(100vh-4.5rem)]" />
    //     ) : (
    //       <RobotMascot className="w-full h-[calc(100vh-4.5rem)]" />
    //     )}
    //   </div>
    // </div>
    <>
    {/* <Sagmetic/> */}
    {/* <AgencyLogoHero/> */}

    <FloatingMascotDock footerRef={footerRef} onSplashComplete={() => setSplashDone(true)}  />
    <SagmeticHero splashDone={splashDone}/>
    <AboutSagmeticSection/>
    <TechnologyExpertiseSection/>
    <ExpertiseSpotlightSection/>
    <AiSolutionsCaseStudySection/>
    <WhatWeDoSection/>
    <FeaturedWorkSection/>
    <AiWorkflowSection/>
    <StatsAndCtaSection/>
    <FaqSection/>
    <ContactAndFooterSection/>
    
    {/* <AiCircuitHeroBg/> */}
    </>
  );
}
