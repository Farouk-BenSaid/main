"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const navLinks = ["About", "Work", "Skills", "Contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const bar1 = useRef<HTMLSpanElement>(null);
  const bar2 = useRef<HTMLSpanElement>(null);
  const bar3 = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.6 });

      tl.fromTo(
        navRef.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" },
      )
        .fromTo(
          logoRef.current,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          dotRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(3)" },
          "-=0.3",
        )
        .fromTo(
          linksRef.current!.children,
          { opacity: 0, y: -8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.07,
          },
          "-=0.4",
        );
    });

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      gsap.to(bar1.current, {
        rotate: 45,
        y: 6,
        duration: 0.3,
        ease: "expo.out",
      });
      gsap.to(bar2.current, { opacity: 0, duration: 0.15 });
      gsap.to(bar3.current, {
        rotate: -45,
        y: -6,
        duration: 0.3,
        ease: "expo.out",
      });
    } else {
      gsap.to(bar1.current, {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "expo.out",
      });
      gsap.to(bar2.current, { opacity: 1, duration: 0.2, delay: 0.1 });
      gsap.to(bar3.current, {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "expo.out",
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(drawer, { display: "flex" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(drawer, { opacity: 0 }, { opacity: 1, duration: 0.35 }).fromTo(
        ".mob-item",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
        "-=0.15",
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(drawer, {
        opacity: 0,
        duration: 0.25,
        ease: "expo.in",
        onComplete: () => {
          gsap.set(drawer, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document
        .getElementById(id.toLowerCase())
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          scrolled || menuOpen
            ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/5"
            : "py-6 bg-transparent"
        }`}
      >
        <div
          ref={logoRef}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => scrollTo("hero")}
        >
          <span
            ref={dotRef}
            className="w-1.5 h-1.5 rounded-full bg-(--color-accent-cyan) group-hover:scale-150 transition-transform duration-300"
          />
          <span className="text-xs uppercase tracking-[0.25em] text-white/80 font-mono group-hover:text-white transition-colors duration-300">
            Farouk-studio
          </span>
        </div>

        <ul
          ref={linksRef}
          className="hidden md:flex items-center gap-8 list-none"
        >
          {navLinks.map((link) => (
            <li key={link}>
              <a
                onClick={() => scrollTo(link)}
                className="group relative text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono hover:text-white transition-colors cursor-pointer"
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-(--color-accent-cyan) group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-(--color-accent-cyan) animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-mono">
            Available
          </span>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-end gap-1.25 w-8 h-8 z-50 shrink-0"
          aria-label="Toggle menu"
        >
          <span
            ref={bar1}
            className="block h-px bg-white/70 origin-center"
            style={{ width: 20 }}
          />
          <span
            ref={bar2}
            className="block h-px bg-white/70 origin-center"
            style={{ width: 14 }}
          />
          <span
            ref={bar3}
            className="block h-px bg-white/70 origin-center"
            style={{ width: 20 }}
          />
        </button>
      </nav>

      <div
        ref={drawerRef}
        className="fixed inset-0 z-40 flex-col justify-between px-6 pt-24 pb-12"
        style={{
          display: "none",
          background: "rgba(4,4,4,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        <ul className="flex flex-col list-none">
          {navLinks.map((link, i) => (
            <li key={link} className="mob-item border-b border-white/5">
              <button
                onClick={() => scrollTo(link)}
                className="group flex items-center justify-between w-full py-5 text-left"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-[10px] font-mono text-white/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(28px,8vw,48px)] font-display font-extralight tracking-tight text-white/70 group-hover:text-white transition-colors duration-300">
                    {link}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-white/20 group-hover:text-[#22D3EE] transition-colors duration-300 shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 13L13 3M13 3H6M13 3V10"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="mob-item flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent-cyan) animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/30">
              Available for projects
            </span>
          </div>
          <a
            href="mailto:farouk@studio.io"
            className="text-sm font-mono text-white/25 hover:text-[#22D3EE] transition-colors duration-300"
          >
            farouk@studio.io
          </a>
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/10">
            © {new Date().getFullYear()} Farouk-Studio
          </span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
