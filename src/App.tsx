import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BlinkingSquares } from './components/ui/BlinkingSquares';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#09090B] font-sans selection:bg-[#09090B] selection:text-[#FFFFFF] antialiased flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* 1. NAVBAR                                                                */}
      {/* ========================================================================= */}
      <header className="w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand / Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 bg-[#09090B] text-white flex items-center justify-center rounded-xs font-mono text-xs font-bold transition-transform group-hover:scale-105">
              S
            </div>
            <span className="font-bold tracking-tight text-base text-[#09090B] font-mono">
              S.pichayut
            </span>
          </a>

          {/* Nav Menu Links (Mocked) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#work" className="hover:text-black transition-colors">
              Work
            </a>
            <a href="#projects" className="hover:text-black transition-colors">
              Projects
            </a>
            <a href="#experience" className="hover:text-black transition-colors">
              Experience
            </a>
            <a href="#about" className="hover:text-black transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-black transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-[#09090B] text-white hover:bg-neutral-800 text-xs sm:text-sm font-medium px-4 py-2 rounded-md transition-all shadow-xs"
            >
              Get in touch
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH BLINKING SQUARES BACKGROUND & GRID LAYOUT           */}
      {/* ========================================================================= */}
      <main className="relative flex-1 flex flex-col justify-center overflow-hidden border-b border-neutral-200">
        
        {/* React Bits Pro Blinking Squares Background (Fine & Delicate High-Density Grid) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <BlinkingSquares
            direction="right"
            gridSize={16}
            squareSize={0.55}
            fadeStart={0.35}
            fadeEnd={0.98}
            falloff={1.35}
            minBrightness={0.35}
            twinkleSpeed={1.2}
            twinkleStrength={0.92}
            intensity={1.0}
            opacity={0.75}
            squareColor="#52525b"
            background="#FFFFFF"
          />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12 md:pb-16 w-full">
          <div className="max-w-3xl">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#09090B] leading-[1.06]">
              Building high-craft interfaces & digital systems.
            </h1>

            {/* Subtitle / Bio */}
            <p className="mt-6 text-base sm:text-xl text-neutral-600 leading-relaxed font-normal max-w-2xl">
              Software engineer & interface designer focused on minimalist, developer-grade web applications,
              tactile micro-interactions, and robust TypeScript architectures.
            </p>

            {/* CTA Button Group (Solid Black Buttons) */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 bg-[#09090B] hover:bg-neutral-800 text-white text-sm font-medium px-6 py-3 rounded-md transition-all shadow-xs group"
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-neutral-300 hover:border-neutral-900 bg-white text-neutral-900 text-sm font-medium px-6 py-3 rounded-md transition-all"
              >
                <span>Read Experience</span>
              </a>
            </div>

          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="w-full bg-white py-6 px-6 text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">S.pichayut</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/PichyyyNews"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="#"
              className="hover:text-black transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter</span>
            </a>
            <a
              href="#"
              className="hover:text-black transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.21a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
