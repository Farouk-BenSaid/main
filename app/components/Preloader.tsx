"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void; // Callback to be called when the preloader is complete
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  hue: number;
  life: number; // 0 -> 1
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBotRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dots: Dot[] = []; // particle burst array
    let rafId = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // limit to 2x for retina screens
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = (cx: number, cy: number, count: number, speed: number) => {
      for (let i = 0; i < count; i++) {
        const angel = (i / count) * Math.PI + Math.random() * 0.4;
        const spd = speed * (0.6 + Math.random() * 0.8);
        dots.push({
          x: cx,
          y: cy,
          vx: Math.cos(angel) * spd,
          vy: Math.sin(angel) * spd,
          alpha: 0.7 + Math.random() * 0.3,
          size: Math.random() * 2.5 + 0.8,
          hue: 185 + Math.random() * 60,
          life: 0,
        });
      }
    };

    setTimeout(() => {
      burst(window.innerWidth / 2, window.innerHeight / 2, 80, 5);
    }, 200);
    setTimeout(() => {
      burst(window.innerWidth / 2, window.innerHeight / 2, 50, 3);
    }, 700);

    const draw = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      t += 0.016;

      ctx.clearRect(0, 0, W, H);

      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "#22D3EE";
      ctx.lineWidth = 0.5;
      const gSize = 60;
      for (let x = 0; x < W; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // scanline
      const scanY = ((t * 80) % (H + 40)) - 20;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, "rgba(34,211,238,0)");
      scanGrad.addColorStop(0.5, "rgba(34,211,238,0.06)");
      scanGrad.addColorStop(1, "rgba(34,211,238,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, W, 40);

      // particles
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life += 0.012;
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.96;
        d.vy *= 0.96;
        d.alpha = Math.max(0, 0.9 - d.life * 0.9);

        if (d.alpha <= 0) {
          dots.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${d.hue}, 90%, 70%)`;
        ctx.fill();
      }

      // noise grain overlay
      ctx.globalAlpha = 0.025;
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
        ctx.fillRect(
          Math.random() * W,
          Math.random() * H,
          Math.random() * 2,
          Math.random() * 2,
        );
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    // couter animation count 0 -> 100 over 2.4s with easing
    const startTime = performance.now(); // get start time of animation in ms
    const countDur = 2400; // duration of animation in ms
    let countFrame = 0; // current frame of animation

    const animCount = (now: number) => {
      const progress = Math.min((now - startTime) / countDur, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic easing
      const value = Math.round(eased * 100); // round to nearest integer
      setCount(value);

      // bar fill
      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${eased})`;
      }

      if (progress < 1) {
        countFrame = requestAnimationFrame(animCount);
      } else {
        const exitTl = gsap.timeline({
          onComplete: onComplete,
        });

        burst(window.innerWidth / 2, window.innerHeight / 2, 120, 8);

        exitTl
          .to(
            [
              counterRef.current,
              barRef.current,
              labelRef.current,
              logoRef.current,
            ],
            {
              opacity: 0,
              y: -20,
              duration: 0.4,
              stagger: 0.06,
              ease: "expo.in",
            },
          )
          .to(
            curtainTopRef.current,
            {
              yPercent: -100,
              duration: 0.85,
              ease: "expo.inOut",
            },
            0.3,
          )
          .to(
            curtainBotRef.current,
            {
              yPercent: 100,
              duration: 0.85,
              ease: "expo.inOut",
            },
            0.3,
          )
          .to(
            rootRef.current,
            {
              opacity: 0,
              duration: 0.3,
              ease: "power2.out",
            },
            0.9,
          );
      }
    };
    countFrame = requestAnimationFrame(animCount);

    gsap.set(
      [logoRef.current, labelRef.current, barRef.current, counterRef.current],
      {
        opacity: 0,
      },
    );

    const entranceTl = gsap.timeline({
      delay: 0.15,
    });
    entranceTl
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
        },
      )
      .to(
        labelRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "expo.out",
        },
        "-=0.3",
      )
      .to(
        barRef.current,
        {
          opacity: 1,
          duration: 0.4,
        },
        "-=0.2",
      )
      .to(
        counterRef.current,
        {
          opacity: 1,
          duration: 0.4,
        },
        "-=0.3",
      );

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(countFrame);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-200 flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
    >
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "50%",
          background: "linear-gradient(to bottom, #030303 80%, #060606)",
        }}
      />

      <div
        ref={curtainBotRef}
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "50%",
          background: "linear-gradient(to top, #030303 80%, #060606)",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-20 flex flex-col items-center gap-8 px-6 w-full max-w-sm">
        <div ref={logoRef} className="flex flex-col items-center gap-3">
          <div className="realtive w-12 h-12 flex items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className="w-full h-full"
              style={{ animation: "plSpin 6s linear infinite" }}
            >
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="rgba(34,211,238,0.15)"
                strokeWidth="0.5"
                strokeDasharray="4 6"
              />
              <circle cx="24" cy="2" r="2.5" fill="#22D3EE" opacity="0.9" />
            </svg>
            <div
              className="absolute w-2 h-2 rounded-full bg-[#22D3EE]"
              style={{
                boxShadow: "0 0 12px #22D3EE, 0 0 24px rgba(34,211,238,0.4)",
              }}
            />
          </div>

          <span className="text-[11px] uppercase tracking-[0.4em] font-mono text-white/70">
            Farouk-Studio
          </span>
        </div>

        <div ref={labelRef} className="flex items-center gap-3">
          <div className="w-8 h-px bg-linear-to-r from-transparent to-[#22D3EE]" />
          <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-white/25">
            Initializing systems
          </span>
          <div className="w-8 h-px bg-linear-to-l from-transparent to-[#22D3EE]" />
        </div>

        <div ref={barRef} className="w-full flex flex-col items-center gap-3">
          <div className="relative w-full h-px overflow-hidden bg-[rgba(255,255,255,0.06)]">
            <div
              ref={barFillRef}
              className="absolute inset-y-0 left-0 right-0 origin-left"
              style={{
                background: "linear-gradient(90deg, #22D3EE, #3B82F6, #818CF8)",
                transform: "scaleX(0)",
              }}
            />
            <div
              ref={barFillRef}
              className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full pointer-events-none"
              style={{
                right: 0,
                background: "#22D3EE",
                boxShadow: "0 0 6px #22D3EE",
                display: "none",
              }}
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-[0.2em]">
              SIG.PORTFOLIO
            </span>
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-[0.2em]">
              v2.0.25
            </span>
          </div>
        </div>

        <div ref={counterRef} className="flex items-end gap-1">
          <span
            className="font-display font-extralight text-white leading-none tabular-nums tracking-[-0.04em]"
            style={{
              fontSize: "clamp(56px, 14vw, 96px)",
            }}
          >
            {String(count).padStart(2, "0")}
          </span>
          <span
            className="text-white/20 font-display font-extralight mb-2"
            style={{
              fontSize: "clamp(20px, 5vw, 36px)",
            }}
          >
            %
          </span>
        </div>
      </div>

      {[
        "top-6 left-6",
        "top-6 right-6",
        "bottom-6 left-6",
        "bottom-6 right-6",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} z-20 h-5 pointer-events-none`}
          style={{
            borderTop: i < 2 ? "1px solid rgba(34,211,238,0.2)" : "none",
            borderBottom: i >= 2 ? "1px solid rgab(34,211,238,0.2)" : "none",
            borderLeft: i % 2 === 0 ? "1px solid rgab(34,211,238,0.2)" : "none",
            borderRight:
              i % 2 === 1 ? "1px solid rgba(34,211,238,0.2)" : "none",
          }}
        />
      ))}

      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-6 pointer-events-none">
        {["Front-end Dev", "UI/UX Design", "Tunisia"].map((item, i) => (
          <span
            key={i}
            className="text-[8px] uppercase tracking-[0.25em] font-mono text-white/10"
          >
            {item}
          </span>
        ))}
      </div>

      <style>
        {`
        @keyframes plSpin { to { transform: rotate(360deg); } }
      `}
      </style>
    </div>
  );
};

export default Preloader;
