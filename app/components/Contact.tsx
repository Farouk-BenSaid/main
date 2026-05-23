"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtSign, Code2, Globe, Mail, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  {
    id: "email",
    label: "Email",
    value: "bensaidf232@gmail.com",
    icon: Mail,
    color: "#22D3EE",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/farouk-ben-said",
    href: "https://www.linkedin.com/in/farouk-ben-said-480910306/",
    icon: Globe,
    color: "#3B82F6",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/Farouk-BenSaid",
    href: "https://github.com/Farouk-BenSaid",
    icon: Code2,
    color: "#818CF8",
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@farouk_bensaid_",
    href: "https://www.instagram.com/farouk_bensaid_",
    icon: AtSign,
    color: "#F472B6",
  },
  {
    id: "phone",
    label: "Phone",
    value: "+216 51 706 261",
    icon: Phone,
    color: "#34D399",
  },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function useScramble(finalText: string, trigger: boolean, duration = 1400) {
  const [display, setDisplay] = useState(finalText.replace(/[^ ]/g, CHARS[0]));
  const raf = useRef(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const len = finalText.length;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const resolved = Math.floor(p * len);
      let result = "";
      for (let i = 0; i < len; i++) {
        result +=
          i < resolved || finalText[i] === " "
            ? finalText[i]
            : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(result);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [trigger, finalText, duration]);
  return display;
}

function FooterCTA() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;

      gsap.to(line1Ref.current, {
        x: nx * 40,
        y: ny * 28 - 12,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(line2Ref.current, {
        x: nx * -40,
        y: ny * 28 + 12,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(cursorRef.current, {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onEnter = () => {
      setInside(true);
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
    };

    const onLeave = () => {
      setInside(false);
      gsap.to([line1Ref.current, line2Ref.current], {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1,0.4)",
      });
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.25 });
    };

    wrap.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden cursor-none select-none"
      style={{
        paddingTop: "clamp(60px, 10vh, 120px)",
        paddingBottom: "clamp(60px, 10vh, 120px)",
      }}
      onClick={() =>
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      <div
        ref={cursorRef}
        className="pointer-events-none absolute z-20 flex items-center justify-center rounded-full"
        style={{
          width: 110,
          height: 110,
          background: "rgba(34,211,238,0.12)",
          border: "1px solid rgba(34,211,238,0.3)",
          transform: "translate(-50%,-50%) scale(0)",
          opacity: 0,
          backdropFilter: "blur(4px)",
          top: 0,
          left: 0,
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-[#22D3EE]/80">
          Reach out
        </span>
      </div>

      {/* Line 1 */}
      <div ref={line1Ref} className="will-change-transform">
        <span
          className="block font-display font-extralight tracking-[-0.04em] leading-none uppercase text-white"
          style={{ fontSize: "clamp(52px, 10vw, 148px)" }}
        >
          Let &apos; s work
        </span>
      </div>

      <div ref={line2Ref} className="will-change-transform">
        <span
          className="block font-display font-extralight tracking-[-0.04em] leading-none uppercase"
          style={{
            fontSize: "clamp(52px, 10vw, 148px)",
            WebkitTextStroke: "1px rgba(255,255,255,0.25)",
            color: "transparent",
          }}
        >
          together.
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 60%)",
          opacity: inside ? 1 : 0,
        }}
      />
    </div>
  );
}

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const word1 = useScramble("START", triggered, 900);
  const word2 = useScramble("A", triggered, 500);
  const word3 = useScramble("CONVERSATION", triggered, 1500);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.set(".ct-head", { opacity: 0, y: 32 });
      gsap.set(".ct-sub", { opacity: 0 });
      gsap.set(".ct-row", { opacity: 0, y: 16 });
      gsap.set(".ct-foot", { opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        once: true,
        onEnter: () => {
          setTriggered(true);
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(".ct-head", { opacity: 1, y: 0, duration: 1 })
            .to(".ct-sub", { opacity: 1, duration: 0.7 }, "-=0.6")
            .to(
              ".ct-row",
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
              "-=0.4",
            )
            .to(".ct-foot", { opacity: 1, duration: 0.6 }, "-=0.3");
        },
      });
    },
    { scope: sectionRef },
  );

  const activeColor = hovered
    ? LINKS.find((l) => l.id === hovered)?.color
    : null;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full flex flex-col bg-(--color-bg) overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px",
        }}
      />

      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/2 transition-all duration-700"
        style={{
          background: activeColor
            ? `radial-gradient(ellipse at 80% 50%, ${activeColor}0c 0%, transparent 65%)`
            : "none",
        }}
      />

      <div className="relative z-10 flex flex-col px-6 sm:px-12 lg:px-24 pt-10 pb-20">
        <div className="mb-16 sm:mb-24">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-mono">
            04 // Contact
          </span>
        </div>

        <div className="ct-head mb-16 sm:mb-20">
          <h2
            className="font-display font-extralight tracking-[-0.03em] leading-none uppercase text-white"
            style={{ fontSize: "clamp(36px, 6.5vw, 104px)" }}
          >
            {word1}&nbsp;<span className="text-white/20">{word2}</span>
            <br />
            {word3}
          </h2>
          <p className="ct-sub mt-5 text-sm text-white/25 font-light leading-relaxed max-w-xs">
            Building interfaces that transmit.
            <br />
            The signal is open.
          </p>
        </div>

        <div
          className="flex flex-col w-full"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {LINKS.map((link) => {
            const isHov = hovered === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-row flex items-center justify-between py-5 sm:py-6 transition-all duration-300"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  paddingLeft: isHov ? "14px" : "0px",
                }}
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span
                  className="text-[11px] uppercase tracking-[0.25em] font-mono w-24 sm:w-28 shrink-0 transition-colors duration-300"
                  style={{
                    color: isHov ? link.color : "rgba(255,255,255,0.22)",
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="flex-1 font-light transition-all duration-300 truncate"
                  style={{
                    fontSize: "clamp(15px, 2vw, 22px)",
                    color: isHov
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.38)",
                    letterSpacing: isHov ? "-0.01em" : "0em",
                  }}
                >
                  {link.value}
                </span>
                <span
                  className="shrink-0 ml-4 transition-all duration-300"
                  style={{
                    opacity: isHov ? 1 : 0,
                    transform: isHov ? "translate(0,0)" : "translate(-6px,6px)",
                    color: link.color,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M4 14L14 4M14 4H6M14 4V12"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <footer
        className="ct-foot relative z-10 w-full"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <FooterCTA />

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-12 lg:px-24 py-6">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] group-hover:scale-150 transition-transform duration-300" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-white/40 group-hover:text-white/70 transition-colors duration-300">
              Farouk-Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#34D399] animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.22em] font-mono text-white/20">
              Available for projects
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/15">
              © {new Date().getFullYear()} Farouk Ben Said
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-mono text-white/20 hover:text-white/50 transition-colors duration-300"
            >
              <span>↑</span>
              <span className="group-hover:underline underline-offset-2">
                Top
              </span>
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
