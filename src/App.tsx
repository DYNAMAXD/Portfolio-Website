import { useEffect, useState } from 'react';

// import './global.css';

import Navbar from './components/navbar/Navbar';
import HeroSection from './components/hero/HeroSection';
import SkillsSection from './components/skills/SkillsSection';
import CustomCursor from './components/cursor/CustomCursor';
import ProjectsSection from './components/project/ProjectsSection';
import ContactSection from './components/contact/ContactSection';

export default function App() {

  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {

    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const handleChange = () => {
      setShowCursor(!mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener('change', handleChange);

    return () => { 
      mediaQuery.removeEventListener('change', handleChange);
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