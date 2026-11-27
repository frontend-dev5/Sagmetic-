import React from 'react'
import SagmeticHero from '../sagmetic/SagmeticHero'
import WhoWeAre from '../Aboutpage/WhoWeAre'
import MobSolution from '../Aboutpage/MobSolution'
import OurAgency from '../Aboutpage/OurAgency'
import ContactAndFooterSection from '../sagmetic/ContactAndFooterSection'
import Testimonial from '../Aboutpage/Testimonial'

function About() {
  return (
    <>
      <SagmeticHero />
      <WhoWeAre />
      <MobSolution />
      <OurAgency />
      <Testimonial />

      <ContactAndFooterSection />

    </>
  )
}

export default About