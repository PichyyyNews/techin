import React, { useState } from 'react';
import { Play, Layers, Box, Cpu } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { AsciiHalftoneCanvas } from './components/visual/AsciiHalftoneCanvas';
import { PixelDitherGrid } from './components/visual/PixelDitherGrid';
import { DottedGlobeCanvas } from './components/visual/DottedGlobeCanvas';
import { ScaffoldCard } from './components/ui/ScaffoldCard';
import { MetricsBar } from './components/ui/MetricsBar';
import { ThemeToggle } from './components/ui/ThemeToggle';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'frame' | 'pixelpush'>('all');

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#EEEEEE] selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 transition-colors duration-200">
      
      {/* Top Banner / Preset Switcher */}
      <div className="w-full bg-neutral-900 dark:bg-neutral-950 text-white text-xs py-2 px-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-semibold text-neutral-300">NO-AI-SLOP DESIGN SYSTEM</span>
          <span className="text-neutral-500 hidden sm:inline">| React + TypeScript + ReactBits MCP</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'all' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setActiveTab('frame')}
            className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'frame' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Frame (Img 1-2)
          </button>
          <button
            onClick={() => setActiveTab('pixelpush')}
            className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'pixelpush' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pixelpush (Img 3-5)
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <Navbar mode={activeTab === 'pixelpush' ? 'pixelpush' : 'frame'} />

      <main className="w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* SECTION 1: FRAME HERO (Reference Image 1)                                */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'frame') && (
          <section className="w-full max-w-6xl mx-auto px-6 py-12 md:py-20 border-b border-neutral-200/80 dark:border-neutral-800/80">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Massive Headline & Strict CTAs */}
              <div className="flex flex-col items-start justify-center max-w-xl">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.05]">
                  A baseline for products that move quickly.
                </h1>

                {/* CTA Button Group */}
                <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
                  <button className="bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xs">
                    Get Started
                  </button>

                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors group">
                    <span>Learn More</span>
                    <span className="w-5 h-5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: ASCII Halftone Circular Art */}
              <div className="w-full flex items-center justify-center lg:border-l border-neutral-200/80 dark:border-neutral-800/80 lg:pl-10">
                <AsciiHalftoneCanvas />
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: SCAFFOLD CARDS & SOCIAL PROOF (Reference Image 2)              */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'frame') && (
          <section className="w-full max-w-6xl mx-auto px-6 py-16 sm:py-24 border-b border-neutral-200/80 dark:border-neutral-800/80">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-10 sm:mb-12">
              A scaffold, not a finished product
            </h2>

            {/* 3-Column Minimal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScaffoldCard
                title="Skip the blank canvas →"
                description="Routing, tokens, and layout primitives are wired before you write a line of feature code."
              />
              <ScaffoldCard
                title="Designed to be overwritten →"
                description="Every component is a placeholder you can tear out the moment your real system arrives."
              />
              <ScaffoldCard
                title="Stays out of your way →"
                description="No proprietary abstractions, no hidden magic — just the conventions your team already uses."
              />
            </div>

            {/* Social Proof Strip */}
            <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span>Trusted by teams at</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-sans text-base">
                  Linear
                </span>
              </div>
              <div className="flex items-center gap-6 opacity-60">
                <Layers className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <Box className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <Cpu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: PIXELPUSH HERO (Reference Image 3)                             */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'pixelpush') && (
          <section className="w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Clear Value Prop */}
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
                  Make studio-grade video in minutes, not days.
                </h2>
                <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
                  Pixelpush is the AI video editor that turns raw footage into finished cuts.
                  Edit in plain language, auto-caption in 50+ languages, and generate B-roll on a single timeline.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button className="bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm">
                    Start for free
                  </button>
                  <button className="border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 px-6 py-2.5 rounded-full text-sm font-medium text-neutral-800 dark:text-neutral-200 transition-colors">
                    Watch the demo
                  </button>
                </div>
              </div>

              {/* Right Column: Warm Orange Mosaic Pixel Dithering Grid */}
              <div className="w-full flex items-center justify-center">
                <PixelDitherGrid />
              </div>
            </div>

            {/* Hatched pattern divider bar */}
            <div className="w-full h-8 mt-12 bg-hatched-pattern border-y border-neutral-200/80 dark:border-neutral-800/80" />
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: METRICS & GLOBAL COMMUNITY (Reference Image 4)                 */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'pixelpush') && (
          <section className="w-full">
            {/* 3-Column Hairline Metrics Bar */}
            <MetricsBar />

            {/* Global Community Heading */}
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-8 text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-600 dark:text-orange-500 font-semibold mb-4">
                <span className="w-1.5 h-1.5 bg-orange-600 dark:bg-orange-500 rounded-xs" />
                <span>Global community</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                Creators from all over the world
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl">
                From solo editors to studio teams, Pixelpush powers talented video makers in every timezone.
              </p>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: 3D DOTTED GLOBE & CREATOR PINS (Reference Image 5)             */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'pixelpush') && (
          <section className="w-full overflow-hidden pb-16">
            <div className="max-w-6xl mx-auto px-6">
              <DottedGlobeCanvas />
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 py-8 px-6 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} TECHIN UI • NO-AI-SLOP STANDARD</div>
          <div className="flex items-center gap-4">
            <a href="https://reactbits.dev" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              ReactBits Integration
            </a>
            <span>•</span>
            <a href="#rules" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Strict Rules
            </a>
          </div>
        </div>
      </footer>

      {/* Minimal Floating Theme Switcher */}
      <ThemeToggle />
    </div>
  );
};
