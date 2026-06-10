import './global.css';

import Navbar from './components/navbar/Navbar';
import HeroSection from './components/hero/HeroSection';
import SkillsSection from './components/skills/SkillsSection';
import CustomCursor from './components/cursor/CustomCursor';
import ProjectsSection from './components/project/ProjectsSection';
import ContactSection from './components/contact/ContactSection';
 


export default function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection /> 
      <ContactSection />
    </>
  );
}