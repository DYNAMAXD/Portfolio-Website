import { useEffect, useState } from 'react';

import './global.css'
import Navbar from './components/navbar/Navbar';
import HeroSection from './components/hero/HeroSection';
import SkillsSection from './components/skills/SkillsSection';
import CustomCursor from './components/cursor/CustomCursor';
import ProjectsSection from './components/project/ProjectsSection';
import ContactSection from './components/contact/ContactSection';

export default function App() {

  const [showCursor, setShowCursor] = useState(false); 

  useEffect(() => {

    const checkDevice = () => {

      const isTouchDevice =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      setShowCursor(!isTouchDevice);
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };

  }, []);

  return (
    <>
      {showCursor && <CustomCursor />}

      <Navbar />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}