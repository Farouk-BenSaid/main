"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "GSAP",
  "Three.js",
  "Tailwind",
  "Framer",
  "WebGL",
  "Node.js",
  "Figma",
  "D3.js",
  "WebSockets",
  "Zustand",
  "Prisma",
  "Vercel",
];

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number; // home position
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number; // 185–250 range (cyan→blue)
  isText: boolean; // was sampled from text pixels
}

interface FloatTag {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number; // font size px
  color: string;
}

const TAG_COLORS = ["#22D3EE", "#3B82F6", "#818CF8", "rgba(255,255,255,0.4)"];

function makeTag(W: number, H: number, label: string): FloatTag {
  return {
    label,
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.35 + 0.08,
    size: Math.floor(Math.random() * 6) + 9,
    color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
  };
}

function sampleWave(x: number, t: number, W: number): number {
  const nx = x / W;
  return (
    Math.sin(nx * Math.PI * 6 + t * 1.8) * 0.4 +
    Math.sin(nx * Math.PI * 14 + t * 2.5) * 0.2 +
    Math.sin(nx * Math.PI * 3 - t * 1.2) * 0.4
  );
}
const Playground = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null); // text rasterizer

  // Mutable simulation state — never triggers re-render
  const psRef = useRef<Particle[]>([]);
  const tagsRef = useRef<FloatTag[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, down: false });
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const dissolvedRef = useRef(false); // true once text has been scattered

  const [hovered, setHovered] = useState(false);
  const [dissolved, setDissolved] = useState(false);

  const buildTextParticles = useCallback((W: number, H: number) => {
    const off = offscreenRef.current!;
    off.width = W;
    off.height = H;

    if (!W || !H) return []; // this means canvas is hidden or not mounted

    const octx = off.getContext("2d")!;
    octx.clearRect(0, 0, W, H);

    const fs = Math.min(W / 4.5, 200);
    octx.font = `100 ${fs}px var(--font-display, 'Georgia'), serif`;
    octx.fillStyle = "#ffffff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText("SIGNAL", W / 2, H / 2 - fs * 0.05);

    const imgData = octx.getImageData(0, 0, W, H);
    const data = imgData.data;
    const step = 5; // sample every 5px — controls density
    const text: Particle[] = [];

    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const idx = (py * W + px) * 4;
        if (data[idx + 3] > 128) {
          text.push({
            x: px + Math.random() * step,
            y: py + Math.random() * step,
            ox: px + Math.random() * step,
            oy: py + Math.random() * step,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 1,
            alpha: Math.random() * 0.5 + 0.5,
            hue: 185 + Math.random() * 55,
            isText: true,
          });
        }
      }
    }
    return text;
  }, []);

  const buildAmbient = useCallback((W: number, H: number, count = 60) => {
    return Array.from({ length: count }, (): Particle => {
      const x = Math.random() * W;
      const y = Math.random() * H;
      return {
        x,
        y,
        ox: x,
        oy: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.25 + 0.05,
        hue: 185 + Math.random() * 65,
        isText: false,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    offscreenRef.current = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const dpr = window.devicePixelRatio;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const textPs = buildTextParticles(W, H);
      const ambientPs = buildAmbient(W, H);
      psRef.current = [...textPs, ...ambientPs];
      tagsRef.current = SKILLS.map((s) => makeTag(W, H, s));
      dissolvedRef.current = false;
      setDissolved(false);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
    };
    const onDown = () => {
      mouseRef.current.down = true;
    };
    const onUp = () => {
      mouseRef.current.down = false;
    };
    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const ps = psRef.current;
      const tags = tagsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t = (timeRef.current += 0.012);
      const isDown = mouseRef.current.down;

      ctx.clearRect(0, 0, W, H);
      const vignette = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.1,
        W / 2,
        H / 2,
        H * 0.85,
      );
      vignette.addColorStop(0, "rgba(5,5,5,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      for (const p of ps) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const R = dissolvedRef.current ? 200 : 140;

        if (dist < R) {
          const force = (R - dist) / R;
          if (isDown) {
            p.vx += (dx / dist) * force * 3.5;
            p.vy += (dy / dist) * force * 3.5;
          } else {
            p.vx -= (dx / dist) * force * (dissolvedRef.current ? 4 : 2.5);
            p.vy -= (dy / dist) * force * (dissolvedRef.current ? 4 : 2.5);
          }
        }

        if (p.isText && !dissolvedRef.current) {
          p.vx += (p.ox - p.x) * 0.06;
          p.vy += (p.oy - p.y) * 0.06;
        } else if (p.isText && dissolvedRef.current) {
          p.vx += (p.ox - p.x) * 0.004;
          p.vy += (p.oy - p.y) * 0.004;
        } else {
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10;
          if (p.y > H + 10) p.y = -10;
        }

        p.vx *= 0.87;
        p.vy *= 0.87;
        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = p.alpha * (p.isText ? 1 : 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 90%, 70%)`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      const textPs = ps.filter((p) => p.isText);
      for (let i = 0; i < textPs.length; i += 2) {
        for (let j = i + 2; j < textPs.length; j += 2) {
          const dx = textPs[i].x - textPs[j].x;
          const dy = textPs[i].y - textPs[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 28) {
            const a = (1 - d / 28) * 0.22;
            ctx.beginPath();
            ctx.moveTo(textPs[i].x, textPs[i].y);
            ctx.lineTo(textPs[j].x, textPs[j].y);
            ctx.strokeStyle = `hsl(${textPs[i].hue}, 80%, 65%)`;
            ctx.globalAlpha = a;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      for (const tag of tags) {
        const tdx = mx - tag.x;
        const tdy = my - tag.y;
        const tdist = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
        if (tdist < 120) {
          const tf = ((120 - tdist) / 120) * 0.6;
          tag.vx -= (tdx / tdist) * tf;
          tag.vy -= (tdy / tdist) * tf;
        }

        tag.vx *= 0.96;
        tag.vy *= 0.96;
        tag.x += tag.vx;
        tag.y += tag.vy;

        if (tag.x < -80) tag.x = W + 80;
        if (tag.x > W + 80) tag.x = -80;
        if (tag.y < -30) tag.y = H + 30;
        if (tag.y > H + 30) tag.y = -30;

        ctx.globalAlpha = tag.alpha;
        ctx.font = `300 ${tag.size}px 'SF Mono', 'Fira Code', monospace`;
        ctx.fillStyle = tag.color;
        ctx.fillText(tag.label, tag.x, tag.y);
      }

      if (mx > 0) {
        const cg = ctx.createRadialGradient(
          mx,
          my,
          0,
          mx,
          my,
          isDown ? 100 : 60,
        );
        cg.addColorStop(
          0,
          isDown ? "rgba(59,130,246,0.18)" : "rgba(34,211,238,0.12)",
        );
        cg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, H);

        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = isDown ? "#3B82F6" : "#22D3EE";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(mx - 20, my);
        ctx.lineTo(mx + 20, my);
        ctx.moveTo(mx, my - 20);
        ctx.lineTo(mx, my + 20);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const wY = H - 60;
      const amp = 22;
      ctx.globalAlpha = 0.5;

      // Main wave
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = wY + sampleWave(x, t, W) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const wGrad = ctx.createLinearGradient(0, 0, W, 0);
      wGrad.addColorStop(0, "rgba(34,211,238,0)");
      wGrad.addColorStop(0.2, "#22D3EE");
      wGrad.addColorStop(0.5, "#3B82F6");
      wGrad.addColorStop(0.8, "#22D3EE");
      wGrad.addColorStop(1, "rgba(34,211,238,0)");
      ctx.strokeStyle = wGrad;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Echo wave
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = wY + sampleWave(x, t - 0.3, W) * (amp * 1.6);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#22D3EE";
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [buildTextParticles, buildAmbient]);

  const dissolve = useCallback(() => {
    if (dissolvedRef.current) return;
    dissolvedRef.current = true;
    setDissolved(true);
    const W = canvasRef.current?.offsetWidth ?? 1200;
    const H = canvasRef.current?.offsetHeight ?? 700;
    const ps = psRef.current;
    for (const p of ps) {
      if (!p.isText) continue;
      p.ox = Math.random() * W;
      p.oy = Math.random() * H;
      // Initial burst velocity
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 8 + 3;
      p.vx = Math.cos(ang) * spd;
      p.vy = Math.sin(ang) * spd;
    }
  }, []);

  const reassemble = useCallback(() => {
    if (!dissolvedRef.current) return;
    dissolvedRef.current = false;
    setDissolved(false);
    const ps = psRef.current;
    for (const p of ps) {
      if (!p.isText) continue;
      p.ox = p.ox; // kept from buildTextParticles (the original sample pos)
    }
    const W = canvasRef.current?.offsetWidth ?? 1200;
    const H = canvasRef.current?.offsetHeight ?? 700;
    const fresh = buildTextParticles(W, H);
    // Merge: keep ambient, replace text
    const ambient = ps.filter((p) => !p.isText);
    psRef.current = [...fresh, ...ambient];
  }, [buildTextParticles]);

  useGSAP(
    () => {
      gsap.from(".pg-tag-row > *", {
        opacity: 0,
        y: 10,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-(--color-bg) border-y border-white/5 overflow-hidden"
      style={{ height: "100vh", minHeight: 600 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      <div className="absolute top-8 left-6 md:left-12 lg:left-16 z-10 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-mono">
          03 // Signal Field
        </span>
      </div>

      <div className="absolute top-8 right-6 md:right-12 z-10 pointer-events-none flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#22D3EE] animate-pulse" />
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-mono">
          {hovered
            ? dissolved
              ? "hold to attract"
              : "hover repels · click dissolves"
            : "enter field"}
        </span>
      </div>

      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700"
        style={{ opacity: dissolved ? 0 : 1 }}
      >
        <div className="flex flex-col items-center gap-4 mt-[18vh]">
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full pointer-events-auto cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(34,211,238,0.06)",
              border: "1px solid rgba(34,211,238,0.2)",
            }}
            onClick={dissolve}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#22D3EE]/70">
              Dissolve Field
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-700"
        style={{ opacity: dissolved ? 1 : 0 }}
      >
        <div
          className="flex flex-col items-center gap-6 pointer-events-auto"
          style={{
            opacity: dissolved ? 1 : 0,
            transition: "opacity 0.5s 0.3s",
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] font-mono text-white/20">
            Signal dispersed
          </p>
          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
            onClick={reassemble}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#3B82F6]/80">
              Reassemble
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-16 pb-8 flex items-end justify-between pointer-events-none">
        <div className="pg-tag-row flex items-center gap-3 flex-wrap max-w-[60%]">
          {["React", "Next.js", "GSAP", "TypeScript", "WebGL"].map((s) => (
            <span
              key={s}
              className="text-[9px] uppercase tracking-[0.18em] font-mono px-2.5 py-1 rounded-full"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="pg-tag-row flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.18em] font-mono text-white/15">
            Hold = attract
          </span>
          <div className="w-6 h-px bg-white/10" />
          <span className="text-[9px] uppercase tracking-[0.18em] font-mono text-white/15">
            {SKILLS.length} signals active
          </span>
        </div>
      </div>
    </section>
  );
};

export default Playground;
