import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import Home from "./components/pages/Home";
import Services from "./components/pages/Services";

gsap.registerPlugin(ScrollTrigger);

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

  // Jump to top on route change without fighting Lenis
  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );
}

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
