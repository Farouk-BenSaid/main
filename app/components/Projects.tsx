"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PROJECTS = [
  {
    id: "01",
    title: "Nexus",
    subtitle: "Neural Corp Landing",
    description:
      "A cinematic, scroll-driven experience simulating a classified neural-enhancement corporation. Sequence-based storytelling with counter animations and phase reveals.",
    url: "https://nexus-doc.netlify.app/",
    video: "https://nexus-doc.netlify.app/",
    tags: ["Next.js", "GSAP", "Tailwind"],
    accent: "#c9a84c",
    year: "2024",
  },
  {
    id: "02",
    title: "CipherNexus",
    subtitle: "Cyber Security Portfolio",
    description:
      "A terminal-aesthetic portfolio for a security engineer. Encrypted UI language, AES status indicators, and mission-briefing-style project reveals.",
    url: "https://mahdi-cyb.netlify.app/",
    video: "https://mahdi-cyb.netlify.app/",
    tags: ["Next.js", "GSAP", "Tailwind"],
    accent: "#00f5ff",
    year: "2024",
  },
  {
    id: "03",
    title: "Aether DS",
    subtitle: "Design System Studio",
    description:
      "A brutally minimal design-system agency site. Z-depth composition, spatial interface philosophy, and structural clarity over ornament.",
    url: "https://aether-ds.netlify.app/",
    video: "https://aether-ds.netlify.app/",
    tags: ["Next.js", "GSAP", "Tailwind"],
    accent: "#ffffff",
    year: "2024",
  },
  {
    id: "04",
    title: "Orbita",
    subtitle: "AI Orchestration Platform",
    description:
      "Cognitive operating system for enterprise AI. Unified logic layer, recursive learning UI, and autonomous agent dashboards.",
    url: "https://orbita-oi.netlify.app/",
    video: "https://orbita-oi.netlify.app/",
    tags: ["Next.js", "GSAP", "Tailwind"],
    accent: "#808080",
    year: "2024",
  },
];

const BrowserMockup = ({
  src,
  accent,
  url,
}: {
  src: string;
  accent: string;
  url: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="relative w-full h-full flex flex-col rounded-xl overflow-hidden"
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 0 80px ${accent}18, 0 40px 80px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{
          height: 40,
          background: "#111",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />
          ))}
        </div>
        <div
          className="flex-1 flex items-center gap-2 px-3 rounded-md"
          style={{
            height: 22,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent, opacity: 0.8 }}
          />
          <span className="text-[9px] font-mono truncate text-white/30">
            {src.replace("https://", "")}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded opacity-40 hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3 text-white" />
        </a>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{
                  borderColor: `${accent}60`,
                  borderTopColor: "transparent",
                }}
              />
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/20">
                Loading
              </span>
            </div>
          </div>
        )}
        <iframe
          src={src}
          className="w-full h-full border-0 pointer-events-none"
          style={{
            transform: "scale(0.75)",
            transformOrigin: "0 0",
            width: "133.33%",
            height: "133.33%",
          }}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          title="Project preview"
        />
      </div>
    </div>
  );
};

const DesktopProjects = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      gsap.from(".dproj-header > *", {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: wrapper, start: "top 80%", once: true },
      });

      const totalScroll = track.scrollWidth - window.innerWidth;

      const hTween = gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (s) => {
            if (progressRef.current)
              progressRef.current.style.transform = `scaleX(${s.progress})`;
            setActiveIdx(Math.round(s.progress * (PROJECTS.length - 1)));
          },
        },
      });

      PROJECTS.forEach((_, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.querySelector(`.dproj-card-${i}`),
            containerAnimation: hTween,
            start: "left 85%",
            once: true,
          },
        });
        tl.fromTo(
          `.dproj-num-${i}`,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
        )
          .fromTo(
            `.dproj-title-${i}`,
            { clipPath: "inset(0 100% 0 0)", opacity: 1 },
            { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "expo.out" },
            0.1,
          )
          .fromTo(
            `.dproj-meta-${i}`,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            0.4,
          )
          .fromTo(
            `.dproj-mockup-${i}`,
            {
              yPercent: 6,
              opacity: 0,
              rotateX: 8,
              transformOrigin: "50% 100%",
            },
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              ease: "expo.out",
            },
            0.2,
          );
      });

      ScrollTrigger.refresh();
      return () => hTween.kill();
    },
    { scope: wrapperRef },
  );

  return (
    <section
      id="work"
      ref={wrapperRef}
      className="relative w-full overflow-hidden bg-(--color-bg) h-screen"
    >
      <div className="absolute top-0 left-0 right-0 h-px z-50 bg-white/5">
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{
            transform: "scaleX(0)",
            background: "linear-gradient(90deg,#22D3EE,#3B82F6)",
          }}
        />
      </div>

      <div className="dproj-header absolute top-10 left-6 md:left-12 lg:left-24 z-40 flex flex-col gap-1 overflow-hidden">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-mono">
          02 // Transmissions
        </span>
        <div className="overflow-hidden">
          <h2 className="text-sm md:text-base font-light text-white/60 tracking-tight">
            Selected Works
          </h2>
        </div>
      </div>

      <div className="absolute top-10 right-6 md:right-12 z-40 font-mono text-[10px] text-white/20 tracking-[0.2em]">
        <span className="text-white/60">
          {String(activeIdx + 1).padStart(2, "0")}
        </span>
        <span className="mx-1">/</span>
        {String(PROJECTS.length).padStart(2, "0")}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 opacity-30 pointer-events-none">
        <div className="w-8 h-px bg-white" />
        <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white">
          Scroll
        </span>
        <div className="w-8 h-px bg-white" />
      </div>

      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${PROJECTS.length * 100}vw` }}
      >
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            className={`dproj-card-${i} relative shrink-0 w-screen h-full flex items-center`}
            style={{
              paddingLeft: "clamp(24px,6vw,96px)",
              paddingRight: "clamp(24px,6vw,96px)",
            }}
          >
            <div
              className={`dproj-num-${i} absolute select-none pointer-events-none z-0 font-display font-thin leading-none tracking-[-0.05em] text-white/2.5`}
              style={{
                fontSize: "clamp(120px,18vw,300px)",
                right: "clamp(24px,4vw,64px)",
                bottom: "-0.1em",
              }}
            >
              {p.id}
            </div>

            <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pt-24 pb-16">
              <div className="flex flex-col gap-6 lg:w-[38%] shrink-0">
                <div className="w-8 h-px" style={{ background: p.accent }} />
                <div className="overflow-hidden">
                  <h3
                    className={`dproj-title-${i} font-display font-light tracking-tight text-white`}
                    style={{
                      fontSize: "clamp(32px,4.5vw,64px)",
                      clipPath: "inset(0 100% 0 0)",
                    }}
                  >
                    {p.title}
                  </h3>
                </div>
                <div
                  className={`dproj-meta-${i} flex flex-col gap-5 opacity-0`}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.18em] font-mono opacity-70"
                    style={{ color: p.accent }}
                  >
                    {p.subtitle}
                  </p>
                  <p className="text-sm text-white/50 font-light leading-relaxed max-w-sm">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-[9px] uppercase tracking-[0.15em] font-mono rounded-full"
                        style={{
                          border: `1px solid ${p.accent}30`,
                          color: `${p.accent}80`,
                          background: `${p.accent}08`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-mono text-white/20 tracking-[0.2em]">
                      {p.year}
                    </span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 self-start"
                  >
                    <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-white/40 group-hover:text-white/70 transition-colors duration-300">
                      View Live
                    </span>
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                      style={{
                        borderColor: `${p.accent}40`,
                        background: `${p.accent}10`,
                      }}
                    >
                      <ArrowUpRight
                        className="w-3.5 h-3.5"
                        style={{ color: p.accent }}
                      />
                    </span>
                  </a>
                </div>
              </div>

              <div
                className={`dproj-mockup-${i} flex-1 h-full max-h-[calc(100vh-160px)] min-h-0`}
              >
                <BrowserMockup src={p.video} accent={p.accent} url={p.url} />
              </div>
            </div>

            {i < PROJECTS.length - 1 && (
              <div className="absolute right-0 top-[15%] bottom-[15%] w-px bg-white/4" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const MobileProjects = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".mproj-header > *", {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
      PROJECTS.forEach((_, i) => {
        gsap.fromTo(
          `.mproj-card-${i}`,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: `.mproj-card-${i}`,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-(--color-bg) px-5 pt-20 pb-24"
    >
      <div className="mproj-header flex flex-col gap-1.5 mb-14 overflow-hidden">
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-mono">
          02 // Transmissions
        </span>
        <h2 className="text-2xl font-light text-white/60 tracking-tight">
          Selected Works
        </h2>
      </div>

      <div className="flex flex-col gap-20">
        {PROJECTS.map((p, i) => (
          <div key={p.id} className={`mproj-card-${i} flex flex-col gap-5`}>
            <div className="flex items-baseline gap-3">
              <span className="text-[10px] font-mono text-white/20 shrink-0">
                {p.id}
              </span>
              <h3
                className="font-display font-light tracking-tight text-white leading-tight"
                style={{ fontSize: "clamp(24px,6.5vw,38px)" }}
              >
                {p.title}
              </h3>
            </div>

            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ aspectRatio: "16/10" }}
            >
              <BrowserMockup src={p.video} accent={p.accent} url={p.url} />
            </div>

            <div className="flex flex-col gap-4 pt-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-px shrink-0"
                  style={{ background: p.accent }}
                />
                <p
                  className="text-[10px] uppercase tracking-[0.18em] font-mono opacity-60 truncate"
                  style={{ color: p.accent }}
                >
                  {p.subtitle}
                </p>
              </div>

              <p className="text-sm text-white/40 font-light leading-relaxed">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] font-mono rounded-full"
                    style={{
                      border: `1px solid ${p.accent}25`,
                      color: `${p.accent}65`,
                      background: `${p.accent}06`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="text-[9px] font-mono text-white/20 tracking-[0.2em]">
                  {p.year}
                </span>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/35 group-hover:text-white/70 transition-colors duration-300">
                    View Live
                  </span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-active:scale-95"
                    style={{
                      borderColor: `${p.accent}35`,
                      background: `${p.accent}08`,
                    }}
                  >
                    <ArrowUpRight
                      className="w-3 h-3"
                      style={{ color: p.accent }}
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Projects = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <MobileProjects /> : <DesktopProjects />;
};

export default Projects;
