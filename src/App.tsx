import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { BlinkingSquares } from './components/ui/BlinkingSquares';
import { TextType } from './components/ui/TextType';
import { BadgeCanvas } from './components/ui/BadgeCanvas';
import { DepthCard } from './components/ui/DepthCard';
import { LiquidAscii } from './components/ui/LiquidAscii';
import { ScrollStack, ScrollStackItem } from './components/ui/ScrollStack';

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sticky Hero: only the CONTENT fades and drifts — background stays full-screen
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroWrapperRef,
    offset: ['start start', 'end start'],
  });

  // Content-only transforms — text fades out and drifts up, background untouched
  const heroContentOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroContentY = useTransform(heroProgress, [0, 0.5], [0, -60]);

  const navLinks = [
    { name: 'Practicum', href: '#practicum' },
    { name: 'Institution', href: '#institution' },
    { name: 'Activity Logs', href: '#logs' },
    { name: 'Lesson Plans', href: '#lesson-plans' },
    { name: 'Classroom Research', href: '#research' },
    { name: 'Innovations', href: '#innovations' },
    { name: 'Evaluation', href: '#evaluation' },
  ];

  const institutionItems: ScrollStackItem[] = [
    {
      id: 1,
      code: '01',
      category: 'Vocational Faculty',
      title: 'Department of Information Technology & Computer Business',
      subtitle: 'แผนกวิชาคอมพิวเตอร์ธุรกิจและเทคโนโลยีสารสนเทศ',
      description:
        'ศูนย์กลางการจัดการศึกษาด้านวิชาชีพเทคโนโลยี มุ่งเน้นการบ่มเพาะทักษะวิศวกรรมซอฟต์แวร์ การจัดการฐานข้อมูล และระบบสารสนเทศองค์กรตามมาตรฐานวิชาชีพยุคดิจิทัล',
      image:
        'https://images.unsplash.com/photo-1562774053-701939374585?w=900&auto=format&fit=crop&q=80',
      stats: [
        { value: '600+', label: 'Students' },
        { value: '100%', label: 'Lab Focus' },
        { value: 'สอศ.', label: 'Standard' },
      ],
      action: {
        label: 'View Department',
        href: '#logs',
      },
    },
    {
      id: 2,
      code: '02',
      category: 'Smart Laboratory',
      title: 'Advanced Computing & Embedded IoT Laboratory',
      subtitle: 'ศูนย์ปฏิบัติการคอมพิวเตอร์และนวัตกรรมสมองกลฝังตัว',
      description:
        'ห้องปฏิบัติการคอมพิวเตอร์ความเร็วสูง พร้อมระบบเครือข่ายความเร็วสูง แท่นทดลองอุปกรณ์ IoT (ESP32/Arduino) และสภาพแวดล้อม Local Cloud Sandbox สำหรับการเรียนรู้ Fullstack Development',
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&auto=format&fit=crop&q=80',
      stats: [
        { value: '40+', label: 'Workstations' },
        { value: 'Gigabit', label: 'Network' },
        { value: '24/7', label: 'Lab Access' },
      ],
      action: {
        label: 'Lab Infrastructure',
        href: '#innovations',
      },
    },
    {
      id: 3,
      code: '03',
      category: 'PBL Studio',
      title: 'Project-Based Learning & Digital Innovation Studio',
      subtitle: 'สตูดิโอจัดการเรียนรู้เชิงรุกและพัฒนาโครงงานบูรณาการ',
      description:
        'กระบวนการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นศูนย์กลาง สร้างผลงานจริงที่ตอบสนองโจทย์ชุมชนและสถานประกอบการ เช่น ระบบลงเวลาอัตโนมัติ และโมบายล์แอปพลิเคชันบริการข้อมูล',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
      stats: [
        { value: '12+', label: 'Projects' },
        { value: '4', label: 'Curriculums' },
        { value: 'Active', label: 'Methodology' },
      ],
      action: {
        label: 'Explore Projects',
        href: '#research',
      },
    },
    {
      id: 4,
      code: '04',
      category: 'Mentorship',
      title: 'Skills Competition & Academic Coaching Center',
      subtitle: 'ศูนย์พัฒนาทักษะวิชาชีพและการให้คำปรึกษาโครงงานนวัตกรรม',
      description:
        'การให้คำปรึกษาทางเทคนิคแบบรายกลุ่ม (Mentorship) ฝึกฝนและเตรียมนักศึกษาเข้าร่วมการแข่งขันทักษะวิชาชีพด้านการเขียนโปรแกรมและการพัฒนาเว็บไซต์ในระดับภาคและระดับชาติ',
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80',
      stats: [
        { value: '98%', label: 'Evaluation' },
        { value: '10+', label: 'Awards' },
        { value: '1-on-1', label: 'Mentoring' },
      ],
      action: {
        label: 'Mentorship Log',
        href: '#evaluation',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#09090B] font-sans selection:bg-[#09090B] selection:text-[#FFFFFF] antialiased flex flex-col justify-between overflow-x-clip">
      
      {/* ========================================================================= */}
      {/* 1. NAVBAR (STICKY IN-FLOW AT TOP, FROSTED GLASS ON SCROLL)                */}
      {/* ========================================================================= */}
      <header
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/75 backdrop-blur-2xl border-b border-neutral-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
            : 'bg-white border-b border-neutral-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand / Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 bg-[#09090B] text-white flex items-center justify-center rounded-xs font-mono text-xs font-bold transition-transform group-hover:scale-105">
              S
            </div>
            <span className="font-bold tracking-tight text-sm sm:text-base text-[#09090B] font-mono">
              S.pichayut
            </span>
          </a>

          {/* Desktop Nav Menu Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-black transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center justify-center bg-neutral-900/10 backdrop-blur-sm hover:bg-neutral-900/20 text-[#09090B] text-xs sm:text-sm font-medium px-4 py-2 rounded-md transition-all border border-neutral-200/60"
            >
              Get in touch
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200/40 bg-white/75 backdrop-blur-2xl px-6 py-6 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-neutral-700 hover:text-black py-1 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-neutral-100 mt-2 sm:hidden">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center bg-neutral-900/10 backdrop-blur-sm text-[#09090B] text-sm font-medium py-2.5 rounded-md border border-neutral-200/60"
                >
                  Get in touch
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* HERO (sticky z-0) + ALL SECTIONS (z-10 scrolling over hero)              */}
      {/* ========================================================================= */}
      <div ref={heroWrapperRef} className="relative">

        {/* ─── HERO: Sticky background layer ─── */}
        <div className="sticky top-16 h-[calc(100vh-4rem)] z-0 overflow-hidden bg-[#FFFFFF]">

          {/* Background: static, always full viewport */}
          <div className="absolute inset-0 pointer-events-none">
            <BlinkingSquares
              direction="right"
              gridSize={16}
              squareSize={0.55}
              fadeStart={0.35}
              fadeEnd={1.00}
              falloff={1.25}
              minBrightness={0.55}
              twinkleSpeed={2.05}
              twinkleStrength={0.94}
              intensity={1.00}
              opacity={1.00}
              squareColor="#000000"
              background="#FFFFFF"
            />
          </div>

          {/* Content: fades and drifts up as user scrolls */}
          <motion.div
            style={{ opacity: heroContentOpacity, y: heroContentY }}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full py-12 sm:py-16">
              
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 max-w-2xl py-4 sm:py-6">
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#09090B] leading-[1.15] [text-wrap:balance]">
                  <TextType
                    text="Teaching Practicum Performance & Activity Log"
                    typingSpeed={65}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-neutral-400 font-light"
                  />
                </h1>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl [text-wrap:balance]">
                  Track daily teaching operations, lesson plans, and educational innovations.
                </p>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <a
                    href="#logs"
                    className="inline-flex items-center justify-center gap-2 bg-neutral-900/10 backdrop-blur-sm hover:bg-neutral-900/20 text-[#09090B] text-sm font-medium px-6 py-3 rounded-md transition-all border border-neutral-200/60 group w-full sm:w-auto min-h-[44px]"
                  >
                    <span>Explore Activity Log</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </a>

                  <a
                    href="#plans"
                    className="inline-flex items-center justify-center gap-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 text-neutral-700 hover:text-[#09090B] text-sm font-medium px-6 py-3 rounded-md transition-all border border-neutral-200/40 w-full sm:w-auto min-h-[44px]"
                  >
                    <span>View Lesson Plans</span>
                  </a>
                </div>

              </div>

              {/* Right Column: 3D Badge — hangs right from navbar */}
              <div className="lg:col-span-5 w-full flex items-start justify-center -mt-20 sm:-mt-28 lg:-mt-36">
                <BadgeCanvas />
              </div>

            </div>
          </motion.div>
        </div>

        {/* ─── ALL SECTIONS: Scroll over hero on z-10 ─── */}
        <div className="relative z-10 pointer-events-none">

          {/* Spacer: 100vh so hero is visible for a full screen before sections cover it */}
          <div className="h-[100vh] pointer-events-none" />

          {/* 3. CORE TEACHING SUBJECTS */}
          <section
            id="practicum"
            className="relative pointer-events-auto w-full py-20 sm:py-24 lg:py-28 border-b border-neutral-200 bg-[#FFFFFF] overflow-hidden rounded-t-[28px] sm:rounded-t-[40px] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.1)]"
          >
            {/* Dynamic Fluid ASCII Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <LiquidAscii
                speed={0.90}
                cellSize={15}
                gravity={-25}
                flipRatio={0.30}
                fillHeight={0.30}
                overRelaxation={1.24}
                cursorRadius={0.25}
                cursorForce={66}
                pressureIters={30}
                separationIters={3}
                autoWave={true}
                color="#000000"
                backgroundColor="#FFFFFF"
                opacity={1.00}
              />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Section Header */}
              <div className="max-w-3xl ml-auto text-right mb-12 sm:mb-16">
                <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-2">
                  Curriculum
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090B]">
                  <TextType
                    text="Teaching Practicum Courses"
                    typingSpeed={65}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-neutral-400 font-light"
                    startOnVisible={true}
                  />
                </h2>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal ml-auto max-w-2xl">
                  Active learning methodologies focused on practical software engineering, computational thinking, and digital innovation.
                </p>
              </div>

              {/* 3x Depth Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
                
                {/* Card 1: Web Application Development */}
                <div className="w-full max-w-[380px] flex justify-center">
                  <DepthCard
                    width="100%"
                    height={440}
                    title="Web Application Development"
                    description="Modern web application architecture, deep UI/UX design systems, and frontend engineering with React, TypeScript, and state management."
                    maxRotation={16}
                    maxTranslation={18}
                    spotlight={true}
                    layers={[
                      {
                        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
                        depth: 0.9,
                      },
                      {
                        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
                        depth: 1.4,
                      },
                    ]}
                  />
                </div>

                {/* Card 2: Computer Programming */}
                <div className="w-full max-w-[380px] flex justify-center">
                  <DepthCard
                    width="100%"
                    height={440}
                    title="Computer Programming"
                    description="Foundations of computational thinking, data structures, and systematic algorithmic problem-solving using Python in real-world scenarios."
                    maxRotation={16}
                    maxTranslation={18}
                    spotlight={true}
                    layers={[
                      {
                        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
                        depth: 0.9,
                      },
                      {
                        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
                        depth: 1.4,
                      },
                    ]}
                  />
                </div>

                {/* Card 3: Microcontroller & IoT */}
                <div className="w-full max-w-[380px] flex justify-center">
                  <DepthCard
                    width="100%"
                    height={440}
                    title="Microcontroller & IoT Systems"
                    description="Hardware sensor interfacing, embedded systems design with ESP32/Arduino, and networked IoT telemetry for innovative solutions."
                    maxRotation={16}
                    maxTranslation={18}
                    spotlight={true}
                    layers={[
                      {
                        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
                        depth: 0.9,
                      },
                      {
                        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
                        depth: 1.4,
                      },
                    ]}
                  />
                </div>

              </div>
            </div>
          </section>

          {/* 4. TEACHING INSTITUTION & ENVIRONMENT */}
          <section id="institution" className="relative pointer-events-auto w-full pt-16 sm:pt-20 lg:pt-24 pb-8 border-b border-neutral-200 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
              <div className="max-w-3xl">
                <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-2">
                  Environment & Facilities
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090B]">
                  <TextType
                    text="Practicum Institution & Infrastructure"
                    typingSpeed={65}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-neutral-400 font-light"
                    startOnVisible={true}
                  />
                </h2>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-2xl">
                  Specialized computing laboratories, project development studios, and student mentorship spaces supporting active vocational learning.
                </p>
              </div>
            </div>

            {/* Pinned Scroll Stack Cards */}
            <ScrollStack
              items={institutionItems}
              variant="stack"
              cardWidth={940}
              cardHeight={480}
              peek={28}
              scaleStep={0.04}
              blur={3}
              dim={0.16}
              scrollLength={1}
            />
          </section>

          {/* 5. FOOTER */}
          <footer className="relative pointer-events-auto w-full bg-white py-6 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 font-mono">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900">S.pichayut</span>
                <span>© {new Date().getFullYear()}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <a
                  href="https://github.com/PichyyyNews"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-1.5 py-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="#"
                  className="hover:text-black transition-colors flex items-center gap-1.5 py-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Twitter</span>
                </a>
                <a
                  href="#"
                  className="hover:text-black transition-colors flex items-center gap-1.5 py-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.21a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </footer>

        </div>{/* end z-10 sections container */}

      </div>{/* end heroWrapperRef */}

    </div>
  );
};
