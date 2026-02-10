import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import ScrollToTop from './components/ScrollToTop';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BottomNavbar from './components/BottomNavbar';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Legal from './components/Legal';
import Privacy from './components/Privacy';
import './App.css';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="background-triangle"></div>
      <a 
        href="https://drive.google.com/file/d/1tqkOx8XchXLM84Oz35cWnEJk2esLtZKe/view?usp=drive_link" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="cv-corner" 
        aria-label="Descargar CV"
      ></a>

      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(v => !v)} />

      <div className="flex pt-16">
        <main className="flex-1 md:mr-80 min-h-[calc(100vh-4rem)] flex flex-col pb-20 md:pb-0">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </div>
          <Footer />
        </main>

        <aside className="hidden md:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 border-none overflow-y-auto">
          <Sidebar />
        </aside>
      </div>

      <BottomNavbar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}