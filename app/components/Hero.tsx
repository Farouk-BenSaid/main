"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowDownRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(SplitText);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const cursorLineRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(headingRef.current, {
        type: "chars,words",
        charsClass: "char",
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        noiseRef.current,
        { opacity: 0.6 },
        { opacity: 0, duration: 0.8, ease: "power4.inOut" },
      )
        .set(videoWrapRef.current, {
          borderRadius: "50%",
          scale: 0.85,
          opacity: 0,
        })
        .to(
          videoWrapRef.current,
          {
            opacity: 1,
            scale: 1,
            borderRadius: "0% 0% 0% 60%",
            duration: 1.6,
            ease: "expo.inOut",
          },
          0.3,
        )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 16, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
          0.5,
        )
        .fromTo(
          split.chars,
          { opacity: 0, rotateX: -90, y: 40, transformOrigin: "50% 100%" },
          { opacity: 1, rotateX: 0, y: 0, duration: 0.9, stagger: 0.018 },
          0.8,
        )
        .to(
          videoWrapRef.current,
          { borderRadius: "0% 4% 0% 28%", duration: 2.5, ease: "power3.out" },
          1.6,
        )
        .fromTo(
          cursorLineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.55, ease: "expo.inOut" },
          1.2,
        )
        .to(cursorLineRef.current, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.35,
          ease: "expo.in",
        })
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
          1.6,
        )
        .fromTo(
          btnRef.current,
          { opacity: 0, scale: 0.8, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(2)" },
          1.9,
        );

      gsap.to(videoWrapRef.current, {
        borderRadius: "0% 6% 0% 32%",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 4.5,
      });

      // Mouse parallax — fine pointers only (not touch)
      const onMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        gsap.to(videoWrapRef.current, {
          x,
          y,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      if (window.matchMedia("(pointer:fine)").matches) {
        window.addEventListener("mousemove", onMouseMove);
      }
      return () => window.removeEventListener("mousemove", onMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-(--color-bg)"
    >
      {/* Noise */}
      <div
        ref={noiseRef}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Video mask */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          borderRadius: "50%",
          opacity: 0,
          boxShadow:
            "inset 0 0 0 1px rgba(34,211,238,0.06), -20px 20px 80px rgba(34,211,238,0.04)",
        }}
      >
        <video
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
          style={{ borderRadius: "inherit" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "inherit",
            boxShadow: "inset 0 0 0 1.5px rgba(34,211,238,0.2)",
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute z-10 flex flex-col items-center text-center px-4 w-full">
        {/* Tagline */}
        <div
          ref={taglineRef}
          className="mb-4 md:mb-6 flex items-center gap-3 opacity-0"
        >
          <div className="w-2 h-2 rounded-full bg-(--color-accent-cyan) animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-(--color-accent-cyan) font-medium">
            Welcome
          </span>
        </div>

        {/* Heading — clamp() prevents overflow on any screen width */}
        <div className="relative w-full max-w-6xl mx-auto">
          <h1
            ref={headingRef}
            className="font-display font-light tracking-tighter text-white"
            style={{
              fontSize: "clamp(28px, 6vw, 96px)",
              lineHeight: 1.05,
              perspective: "800px",
            }}
          >
            Front-end Developer & UI/UX Designer
          </h1>
          <div
            ref={cursorLineRef}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-(--color-accent-cyan) to-transparent scale-x-0"
          />
        </div>

        <p
          ref={subRef}
          className="text-sm md:text-base lg:text-lg text-white/60 tracking-wide max-w-sm md:max-w-md mb-10 md:mb-12 mt-4 md:mt-6 opacity-0 px-2"
        >
          Engineering interactive systems and digital transmission experiences.
        </p>

        <button
          ref={btnRef}
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="group relative flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95 opacity-0"
        >
          <div className="absolute inset-0 bg-linear-to-r from-(--color-accent-blue)/20 to-(--color-accent-cyan)/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative text-xs uppercase tracking-[0.2em] font-medium text-white">
            Get Started
          </span>
          <ArrowDownRight className="relative w-4 h-4 text-(--color-accent-cyan) group-hover:-rotate-45 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
