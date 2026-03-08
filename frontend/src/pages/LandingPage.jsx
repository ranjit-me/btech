import React from "react";
import About from "./About";
import Contact from "./Contact";
import Hero from "./Hero";
import Pricing from "./Pricing";
import Main from "./Main";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <Main />
      <About />
      <Pricing />
      <Contact />
    </>
  );
};

export default LandingPage;
