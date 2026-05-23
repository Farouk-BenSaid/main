"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const RINGS = [
  {
    id: "r1",
    rx: 120,
    ry: 28,
    rotateZ: -20,
    z: 40,
    speed: 0.7,
    color: "#22D3EE",
    dotR: 5,
    strokeOpacity: 0.25,
    dash: "",
  },
  {
    id: "r2",
    rx: 90,
    ry: 22,
    rotateZ: 40,
    z: 0,
    speed: -0.5,
    color: "#3B82F6",
    dotR: 4,
    strokeOpacity: 0.2,
    dash: "6 4",
  },
  {
    id: "r3",
    rx: 150,
    ry: 36,
    rotateZ: 10,
    z: -30,
    speed: 0.35,
    color: "#818CF8",
    dotR: 3.5,
    strokeOpacity: 0.15,
    dash: "",
  },
  {
    id: "r4",
    rx: 60,
    ry: 16,
    rotateZ: -55,
    z: 20,
    speed: -0.9,
    color: "#22D3EE",
    dotR: 3,
    strokeOpacity: 0.3,
    dash: "3 6",
  },
];

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const parasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const angleRef = useRef({ x: 20, y: -15 });
  const targetRef = useRef({ x: 20, y: -15 });
  const tickAngles = useRef<number[]>(RINGS.map((_, i) => i * (Math.PI / 2)));

  useEffect(() => {
    let tick: (() => void) | null = null;
    let ctx: gsap.Context | null = null;

    const init = async () => {
      await document.fonts.ready;

      ctx = gsap.context(() => {
        const split = new SplitText(headingRef.current, {
          type: "lines,words",
          linesClass: "overflow-hidden",
          wordsClass: "word",
        });

        const masterTL = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        masterTL
          .fromTo(
            tagRef.current,
            { width: 0, opacity: 1 },
            {
              width: "auto",
              duration: 0.8,
              ease: "power3.out",
              clipPath: "inset(0 0 0 0)",
            },
          )
          .fromTo(
            split.words,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.06,
            },
            0.2,
          )
          .fromTo(
            parasRef.current!.querySelectorAll("p"),
            { opacity: 0, y: 24, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
            },
            0.7,
          )
          .fromTo(
            statsRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            1.0,
          );

        statsRef.current?.querySelectorAll(".stat-num").forEach((el) => {
          const target = parseInt(el.getAttribute("data-target") || "0");
          masterTL.fromTo(
            el,
            { textContent: "00" },
            {
              textContent: target,
              duration: 1.2,
              ease: "power2.out",
              snap: { textContent: 1 },
              onUpdate() {
                (el as HTMLElement).textContent =
                  String(
                    Math.round(Number((el as HTMLElement).textContent)),
                  ).padStart(2, "0") + "+";
              },
            },
            1.0,
          );
        });

        gsap.fromTo(
          sceneRef.current,
          { opacity: 0, scale: 0.75 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              once: true,
            },
          },
        );

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            targetRef.current.x = 30 - self.progress * 60;
          },
        });

        const dots = RINGS.map(
          (_, i) =>
            document.getElementById(
              `orbit-dot-${i}`,
            ) as SVGCircleElement | null,
        );

        tick = () => {
          angleRef.current.x +=
            (targetRef.current.x - angleRef.current.x) * 0.06;
          angleRef.current.y +=
            (targetRef.current.y - angleRef.current.y) * 0.06;

          if (sphereRef.current) {
            sphereRef.current.style.transform = `rotateX(${angleRef.current.x}deg) rotateY(${angleRef.current.y}deg)`;
          }

          RINGS.forEach((ring, i) => {
            tickAngles.current[i] += (ring.speed * Math.PI) / (60 * 6);
            const a = tickAngles.current[i];
            dots[i]?.setAttribute("cx", String(200 + ring.rx * Math.cos(a)));
            dots[i]?.setAttribute("cy", String(200 + ring.ry * Math.sin(a)));
          });
        };
        gsap.ticker.add(tick);
      }, sectionRef);
    };

    init();

    // Mouse parallax — fine pointer only
    const onMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRef.current.y = nx * 30;
      targetRef.current.x = targetRef.current.x * 0.7 + ny * -20 * 0.3;
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: nx * 40,
          y: ny * 40,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };
    if (window.matchMedia("(pointer:fine)").matches) {
      window.addEventListener("mousemove", onMouseMove);
    }

    return () => {
      ctx?.revert();
      if (tick) gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Sphere size — responsive via CSS clamp on the wrapper, SVG scales inside
  const sphereSize = 400;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen flex items-center py-24 px-6 md:px-12 lg:px-24 bg-(--color-bg) overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span
              ref={tagRef}
              className="inline-block text-[10px] uppercase tracking-[0.2em] text-white/20 font-mono whitespace-nowrap overflow-hidden"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              01 // Identity
            </span>
            <h2
              ref={headingRef}
              className="font-display font-light tracking-tight text-white"
              style={{ fontSize: "clamp(26px, 4vw, 52px)" }}
            >
              I build systems, <br />
              <span className="text-white/50">not just interfaces.</span>
            </h2>
          </div>

          <div
            ref={parasRef}
            className="flex flex-col gap-6 text-sm md:text-base text-white/80 font-light leading-relaxed max-w-md"
          >
            <p>
              Every pixel is a transmission. Every interaction is a response.
            </p>
            <p>
              I specialize in bridging the gap between complex engineering and
              fluid human experience. My work focuses on performance, precision,
              and purpose.
            </p>
            <p>No clutter. No noise. Just pure signal.</p>
          </div>

          <div
            ref={statsRef}
            className="flex gap-8 border-t border-white/10 pt-6 opacity-0"
          >
            {[
              { v: "5", label: "Years of Experience" },
              { v: "40", label: "Projects Completed" },
            ].map(({ v, label }) => (
              <div key={label} className="flex flex-col gap-2">
                <span
                  className="stat-num text-2xl font-light text-white tabular-nums"
                  data-target={v}
                >
                  00+
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D sphere
            ── The key fix: w-full + max-w constrains the container.
               The sphere div uses vw-based sizing so it never overflows. ── */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ height: "clamp(280px, 50vw, 560px)" }}
        >
          <div
            ref={glowRef}
            className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* perspective wrapper */}
          <div
            ref={sceneRef}
            className="relative opacity-0"
            style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}
          >
            {/* sphereRef — size is clamped so it never exceeds viewport */}
            <div
              ref={sphereRef}
              style={{
                width: "clamp(240px, 45vw, 400px)",
                height: "clamp(240px, 45vw, 400px)",
                transformStyle: "preserve-3d",
                transform: "rotateX(20deg) rotateY(-15deg)",
                willChange: "transform",
              }}
            >
              {/* Center core */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 10,
                  height: 10,
                  marginLeft: -5,
                  marginTop: -5,
                  borderRadius: "50%",
                  background: "rgba(34,211,238,0.9)",
                  boxShadow:
                    "0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.2)",
                  transform: "translateZ(0px)",
                }}
              />

              {RINGS.map((ring, i) => (
                <div
                  key={ring.id}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 0,
                    height: 0,
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${ring.z}px) rotateZ(${ring.rotateZ}deg)`,
                  }}
                >
                  {/* SVG scales with the sphere via viewBox + width/height = sphereSize */}
                  <svg
                    viewBox="0 0 400 400"
                    width={sphereSize}
                    height={sphereSize}
                    style={{
                      position: "absolute",
                      left: -sphereSize / 2,
                      top: -sphereSize / 2,
                      overflow: "visible",
                    }}
                  >
                    <ellipse
                      cx="200"
                      cy="200"
                      rx={ring.rx}
                      ry={ring.ry}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="0.6"
                      strokeOpacity={ring.strokeOpacity}
                      strokeDasharray={ring.dash}
                    />
                    <circle
                      id={`orbit-dot-${i}`}
                      cx={200 + ring.rx}
                      cy="200"
                      r={ring.dotR}
                      fill={ring.color}
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx={ring.rx}
                      ry={ring.ry}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="1.5"
                      strokeOpacity={0.12}
                      strokeDasharray={`${ring.rx * 0.6} ${ring.rx * 10}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ))}

              {/* Equatorial ring */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 0,
                  height: 0,
                  transform: "translateZ(0px) rotateX(90deg)",
                }}
              >
                <svg
                  viewBox="0 0 400 400"
                  width={sphereSize}
                  height={sphereSize}
                  style={{
                    position: "absolute",
                    left: -sphereSize / 2,
                    top: -sphereSize / 2,
                  }}
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="160"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                    strokeDasharray="2 8"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="100"
                    fill="none"
                    stroke="rgba(59,130,246,0.06)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              {/* Axis lines */}
              {[0, 60, 120].map((deg, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 0,
                    height: 0,
                    transform: `rotateY(${deg}deg)`,
                  }}
                >
                  <svg
                    viewBox="0 0 400 400"
                    width={sphereSize}
                    height={sphereSize}
                    style={{
                      position: "absolute",
                      left: -sphereSize / 2,
                      top: -sphereSize / 2,
                    }}
                  >
                    <line
                      x1="200"
                      y1="40"
                      x2="200"
                      y2="360"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
