
// import './App.css'
// import './plush/face.css'
// import PlushPortrait from './components/PlushPortrait'
// import IndieApp from './components/indiemaker/IndieApp'
// import ShibaMascot from './components/Shiba/ShibaMascot'
// import MochiMascot from './components/mochimascot/MochiMascot'
// import RobotMascot from './components/robotmascot/RobotMascot'
// import { useRef, useState } from 'react'
// import Sagmetic from './components/sagmetic/Sagmetic'
// import AgencyLogoHero from './components/sagmetic/AgencyHeroSculpture'
// import SagmeticHero from './components/sagmetic/SagmeticHero'
// import AiCircuitHeroBg from './components/sagmetic/AiChipCurrentBg'
// import AboutSagmeticSection from './components/sagmetic/AboutSagmeticSection'
// import TechnologyExpertiseSection from './components/sagmetic/TechnologyExpertiseSection'
// import ExpertiseSpotlightSection from './components/sagmetic/ExpertiseSpotlightSection'
// import AiSolutionsCaseStudySection from './components/sagmetic/AiSolutionsCaseStudySection'
// import WhatWeDoSection from './components/sagmetic/WhatWeDoSection'
// import FeaturedWorkSection from './components/sagmetic/FeaturedWorkSection'
// import AiWorkflowSection from './components/sagmetic/AiWorkflowSection'
// import StatsAndCtaSection from './components/sagmetic/StatsAndCtaSection'
// import FaqSection from './components/sagmetic/FaqSection'
// import ContactAndFooterSection from './components/sagmetic/ContactAndFooterSection'
// import FloatingMascotDock from './components/sagmetic/FloatingMascotDock'


// export default function App() {
//   const [active, setActive] = useState('robot');
//   const [splashDone, setSplashDone] = useState(false);
//   const footerRef = useRef(null);

//   return (
//     // <div className="min-h-screen w-full flex flex-col bg-slate-950 text-white">
//     //   <div className="p-4 flex gap-3 z-10">
//     //     <button
//     //       type="button"
//     //       onClick={() => setActive('shiba')}
//     //       className={`px-4 py-2 rounded ${active === 'shiba' ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}
//     //     >
//     //       Shiba Mascot
//     //     </button>
//     //     <button
//     //       type="button"
//     //       onClick={() => setActive('robot')}
//     //       className={`px-4 py-2 rounded ${active === 'robot' ? 'bg-emerald-400 text-black' : 'bg-slate-800'}`}
//     //     >
//     //       Robot Mascot
//     //     </button>
//     //   </div>

//     //   <div className="flex-1 w-full">
//     //     {active === 'shiba' ? (
//     //       <ShibaMascot className="w-full h-[calc(100vh-4.5rem)]" />
//     //     ) : (
//     //       <RobotMascot className="w-full h-[calc(100vh-4.5rem)]" />
//     //     )}
//     //   </div>
//     // </div>
//     <>
//     {/* <Sagmetic/> */}
//     {/* <AgencyLogoHero/> */}

//     <FloatingMascotDock footerRef={footerRef} onSplashComplete={() => setSplashDone(true)}  />
//     <SagmeticHero splashDone={splashDone}/>
//     <AboutSagmeticSection/>
//     <TechnologyExpertiseSection/>
//     <ExpertiseSpotlightSection/>
//     <AiSolutionsCaseStudySection/>
//     <WhatWeDoSection/>
//     <FeaturedWorkSection/>
//     <AiWorkflowSection/>
//     <StatsAndCtaSection/>
//     <FaqSection/>
//     <ContactAndFooterSection/>

//     {/* <AiCircuitHeroBg/> */}
//     </>
//   );
// }



import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home";
import Services from "./components/pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Services />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;