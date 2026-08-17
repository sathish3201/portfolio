import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import LoadingScreen, { LoadingError } from "./components/LoadingScreen";
import { PortfolioDataProvider, usePortfolioData } from "./lib/portfolioDataContext";

function AppContent() {
  const { data, error } = usePortfolioData();

  if (error) return <LoadingError message={error} />;
  if (!data) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioDataProvider>
      <AppContent />
    </PortfolioDataProvider>
  );
}
