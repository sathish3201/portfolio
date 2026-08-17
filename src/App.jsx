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
import { PortfolioDataProvider } from "./lib/portfolioDataContext";

// No loading gate here: PortfolioDataProvider always has data ready
// synchronously (a bundled fallback snapshot), so every section can
// render immediately. It quietly refreshes with live backend data in
// the background — see portfolioDataContext.jsx for why.
export default function App() {
  return (
    <PortfolioDataProvider>
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
    </PortfolioDataProvider>
  );
}
