import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
} from "d3-force";
import { supabase, type BloomRow } from "../../lib/supabase";

// ─── Types ──────────────────────────────────────────────────────────────────
type NodeDef = {
  id: string;
  label: string;
  sublabel?: string;
  desc?: string;
  type: "center" | "branch";
  num?: string;
};
type SimNode = NodeDef & {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
};
type SimLink = { source: string | SimNode; target: string | SimNode };

// ─── Constants ───────────────────────────────────────────────────────────────
const NODES: NodeDef[] = [
  { id: "center", label: "Fitri Zahwa", sublabel: "Indonesia", type: "center" },
  {
    id: "listen",
    label: "Listen",
    desc: "Music I love, on repeat.",
    type: "branch",
    num: "01",
  },
  {
    id: "drawing",
    label: "Drawing",
    desc: "Thoughts on paper.",
    type: "branch",
    num: "02",
  },
  {
    id: "read",
    label: "Read",
    desc: "Books, words, and worlds.",
    type: "branch",
    num: "03",
  },
  {
    id: "pixelart",
    label: "Pixel Art",
    desc: "Tiny pixels, big stories.",
    type: "branch",
    num: "04",
  },
  {
    id: "testimony",
    label: "Testimony",
    desc: "Kind words from amazing people.",
    type: "branch",
    num: "05",
  },
  {
    id: "project",
    label: "Project",
    desc: "Things I've built with love.",
    type: "branch",
    num: "06",
  },
  {
    id: "watch",
    label: "Watch",
    desc: "Inspiration in motion.",
    type: "branch",
    num: "07",
  },
  {
    id: "about",
    label: "About",
    desc: "More about me.",
    type: "branch",
    num: "08",
  },
  {
    id: "resume",
    label: "Resume",
    desc: "My journey so far.",
    type: "branch",
    num: "09",
  },
];

const LINKS: { source: string; target: string }[] = [
  { source: "center", target: "about" },
  { source: "center", target: "resume" },
  { source: "center", target: "project" },
  { source: "center", target: "testimony" },
  { source: "center", target: "read" },
  { source: "center", target: "listen" },
  { source: "center", target: "watch" },
  { source: "center", target: "drawing" },
  { source: "center", target: "pixelart" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ns = "http://www.w3.org/2000/svg";
const el = (tag: string) => document.createElementNS(ns, tag);
const txt = (
  content: string,
  opts: {
    size?: number;
    weight?: number;
    fill?: string;
    anchor?: string;
    dy?: number;
  },
) => {
  const t = el("text");
  t.setAttribute("font-family", "Inter, system-ui, sans-serif");
  t.setAttribute("font-size", String(opts.size ?? 16));
  t.setAttribute("font-weight", String(opts.weight ?? 400));
  t.setAttribute("fill", opts.fill ?? "#000000");
  t.setAttribute("text-anchor", opts.anchor ?? "middle");
  t.setAttribute("dominant-baseline", "middle");
  t.setAttribute("pointer-events", "none");
  if (opts.dy !== undefined) t.setAttribute("dy", String(opts.dy));
  t.textContent = content;
  return t;
};

const LOCATION_ICON_PATH =
  "M18.2961 4.63699C17.4832 3.78975 16.5074 3.11561 15.4274 2.65509C14.3473 2.19457 13.1853 1.95715 12.0111 1.95715C10.837 1.95715 9.67495 2.19457 8.59489 2.65509C7.51482 3.11561 6.53902 3.78975 5.72613 4.63699C4.19613 6.63699 3.72613 9.63698 4.58613 12.717C5.46613 16.047 7.81612 18.457 9.70612 20.387L10.6261 21.387C10.8048 21.5766 11.0188 21.7295 11.2561 21.837C11.4938 21.9426 11.751 21.9971 12.0111 21.9971C12.2712 21.9971 12.5284 21.9426 12.7661 21.837C12.999 21.7313 13.2095 21.582 13.3861 21.397L14.3161 20.397C16.2061 18.467 18.5561 16.057 19.4361 12.727C20.2461 9.63699 19.8261 6.63699 18.2961 4.63699ZM12.0061 12.887C11.3178 12.887 10.645 12.6829 10.0727 12.3005C9.50046 11.9181 9.05442 11.3746 8.79102 10.7387C8.52763 10.1029 8.45872 9.40314 8.59299 8.72809C8.72727 8.05303 9.0587 7.43295 9.54539 6.94626C10.0321 6.45957 10.6521 6.12814 11.3272 5.99387C12.0023 5.85959 12.702 5.9285 13.3379 6.19189C13.9738 6.45529 14.5172 6.90132 14.8996 7.4736C15.282 8.04589 15.4861 8.7187 15.4861 9.40698C15.4861 9.86351 15.396 10.3156 15.221 10.7372C15.046 11.1589 14.7895 11.5418 14.4663 11.8642C14.143 12.1865 13.7593 12.4419 13.3371 12.6157C12.915 12.7895 12.4627 12.8783 12.0061 12.877V12.887Z";

// ─── Project Page Overlay ────────────────────────────────────────────────────
const PROJECT_ITEMS: Array<{
  num: string;
  title: string;
  desc: string;
  tags: string[];
  role: string;
  team: string;
  timeframe: string;
  caseStudy?: string;
}> = [
  {
    num: "01",
    title: "Fishdoro",
    desc: "A Pomodoro timer redesigned as a pixel art fishing mini-game. Completing focus sessions means catching pixel fish.",
    tags: ["UX Design", "Development", "Pixel Art"],
    role: "UI/UX Designer · Developer",
    team: "Solo Project",
    timeframe: "2024 – Present",
    caseStudy: "fishdoro",
  },
  {
    num: "02",
    title: "Title",
    desc: "Desc",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    role: "Placeholder Role",
    team: "Placeholder Team",
    timeframe: "Mar 2025 - Jun 2025",
  },
  {
    num: "03",
    title: "Title",
    desc: "Desc",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    role: "Placeholder Role",
    team: "Placeholder Team",
    timeframe: "Jul 2024 - Dec 2024",
  },
  {
    num: "04",
    title: "Title",
    desc: "Desc",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    role: "Placeholder Role",
    team: "Placeholder Team",
    timeframe: "Aug 2023 - Feb 2024",
  },
];

const INSIGHT_CARDS = [
  {
    frontSub: "Insight 01",
    front: "The Guilt Spiral",
    back: 'Missing even one Pomodoro often leads to abandoning the system entirely. "If I missed one, why bother?" — a pattern repeated across 23 threads.',
  },
  {
    frontSub: "Insight 02",
    front: "Decoupled Rewards",
    back: "External rewards (checking phone, getting coffee) physically break focus state. The reward dismantles the very thing it was meant to celebrate.",
  },
  {
    frontSub: "Insight 03",
    front: "Progress Hunger",
    back: 'Users want time to feel like space, not subtraction. "25:00 → 0:00 feels like losing time, not gaining anything." They want to see growth.',
  },
];

const DEFINE_PROBLEMS = [
  {
    num: "01",
    problem: "No ceremony at the end",
    desc: "Focus sessions end abruptly. There's no acknowledgment that you finished something difficult. The timer just... stops.",
  },
  {
    num: "02",
    problem: "Rewards are external and interruptive",
    desc: "Treating yourself to something after focus means leaving the focused state. The reward itself becomes the distraction.",
  },
  {
    num: "03",
    problem: "Abstract numbers don't feel like progress",
    desc: "Watching 25:00 count down to 0 maps to subtraction, not accomplishment. It doesn't feel like building anything.",
  },
];

const FISHDORO_ANNOTATIONS = [
  {
    id: 1,
    x: 28,
    y: 32,
    label: "Focus timer",
    desc: "25-minute countdown embedded in the pond scene — not separate from it. Time as an environment, not a number.",
  },
  {
    id: 2,
    x: 70,
    y: 48,
    label: "Live pond",
    desc: "Fish swim in real time. Each completed session adds one to your pond. The reward is always visible.",
  },
  {
    id: 3,
    x: 50,
    y: 78,
    label: "Session controls",
    desc: "Single-tap start/pause. No menus. Intentionally one-screen — everything needed is always present.",
  },
  {
    id: 4,
    x: 16,
    y: 62,
    label: "Catch counter",
    desc: "Session count shown as fish caught, not abstract numbers. Growth feels tangible.",
  },
];

const KEY_TAKEAWAYS = [
  {
    num: "01",
    title: "Constraints are creative fuel",
    desc: "Pixel art's 16×16 grid forced every design decision to be intentional. If it doesn't fit, it doesn't ship — and that's a feature, not a bug.",
  },
  {
    num: "02",
    title: "Emotional design > feature completeness",
    desc: "One well-crafted micro-interaction (the fish catch animation) was more impactful than all the settings screens I initially planned.",
  },
  {
    num: "03",
    title: "Building is the best form of user research",
    desc: "Making Fishdoro forced me to actually use a Pomodoro system. I found failure modes in week one that six months of interviews might have missed.",
  },
  {
    num: "04",
    title: "The tool is the prototype",
    desc: "Shipping a rough Electron build early revealed desktop UX patterns — window behavior, tray interactions, keyboard shortcuts — that no Figma prototype could surface.",
  },
];

function FishdoroCaseStudy({ onBack: _onBack }: { onBack: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  // Scroll progress bar — attached to .cs-content, NOT window
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal — IntersectionObserver rooted to .cs-content, NOT window
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const targets = el.querySelectorAll(".cs-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            t.style.opacity = "1";
            t.style.transform = "translateY(0)";
          }
        });
      },
      { root: el, threshold: 0.1, rootMargin: "0px 0px -10px 0px" },
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  function startSliderDrag(e: React.MouseEvent) {
    e.preventDefault();
    const container = sliderRef.current;
    if (!container) return;
    const onMove = (mv: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const p = ((mv.clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.min(92, Math.max(8, p)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  const sectionPill = (label: string) => (
    <div>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 500,
          textTransform: "uppercase" as const,
          letterSpacing: "0.14em",
          color: "#9aaf7a",
          background: "rgba(200,219,160,0.25)",
          border: "1px solid rgba(107,143,78,0.35)",
          borderRadius: "99px",
          padding: "3px 12px",
        }}
      >
        {label}
      </span>
    </div>
  );

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: 0,
    transform: "translateY(16px)",
    transition: `opacity 0.5s ${delay}s, transform 0.5s ${delay}s`,
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Progress bar — attached to scroll content, not window */}
      <div
        style={{
          height: "2px",
          background: "rgba(154,175,122,0.15)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #9aaf7a, #6b8f4e)",
            transition: "width 80ms linear",
          }}
        />
      </div>

      {/* Scrollable content — max-width 640px, same as About Me */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ padding: "40px 24px" }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          {/* ── Hero ── */}
          <div className="cs-reveal flex flex-col gap-3" style={reveal(0)}>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#9aaf7a",
                  background: "rgba(200,219,160,0.25)",
                  border: "1px solid rgba(107,143,78,0.35)",
                  borderRadius: "99px",
                  padding: "3px 12px",
                }}
              >
                Case Study
              </span>
              <span
                style={{ fontSize: "10px", fontWeight: 400, color: "#9aaf7a" }}
              >
                Electron · HTML · CSS · JS
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "28px",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#2d4a1e",
                lineHeight: 1.2,
              }}
            >
              Fishdoro
            </h1>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.6,
              }}
            >
              A Pomodoro timer redesigned as a pixel art fishing mini-game.
              Every completed focus session catches a fish — the reward is
              embedded in the act of focusing, not external to it.
            </p>
            <div
              className="flex items-center gap-6 flex-wrap"
              style={{
                borderTop: "0.5px solid rgba(154,175,122,0.25)",
                paddingTop: "14px",
              }}
            >
              {[
                { label: "Role", value: "UI/UX Designer · Developer" },
                { label: "Stack", value: "Electron · HTML/CSS/JS" },
                { label: "Status", value: "In Development" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#9aaf7a",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#5a7040",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div
            className="cs-reveal"
            style={{
              ...reveal(0.1),
              marginTop: "24px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "0.5px solid rgba(154,175,122,0.3)",
            }}
          >
            <img
              src="/assets/Fishdoro-SS/Hero.jpg"
              alt="Fishdoro — hero"
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div style={{ height: "48px" }} />

          {/* ── Background ── */}
          <section className="flex flex-col gap-4">
            <div className="cs-reveal" style={reveal(0)}>
              {sectionPill("Background")}
            </div>
            <h2
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              The productivity paradox
            </h2>
            <div
              className="cs-reveal"
              style={{
                ...reveal(0.1),
                borderLeft: "2.5px solid rgba(107,143,78,0.4)",
                paddingLeft: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "#2d4a1e",
                  lineHeight: 1.5,
                }}
              >
                "What if the reward was part of the focus itself?"
              </p>
            </div>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.15),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              Most productivity apps promise to help you focus. In practice,
              they add cognitive overhead — more notifications, more dashboards,
              more decisions. The tool becomes the distraction.
            </p>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.2),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              Fishdoro started with a single question:{" "}
              <span style={{ color: "#2d4a1e", fontWeight: 500 }}>
                what if the reward mechanism was built into the timer itself
              </span>{" "}
              — not a badge you check later, but something that happens in real
              time as you focus?
            </p>
          </section>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
              margin: "40px 0",
            }}
          />

          {/* ── Discover ── */}
          <section className="flex flex-col gap-4">
            <div className="cs-reveal" style={reveal(0)}>
              {sectionPill("Discover")}
            </div>
            <h2
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              What are people actually struggling with?
            </h2>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.1),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              Research method: qualitative analysis of Reddit threads from{" "}
              <span style={{ color: "#4e7a30", fontWeight: 400 }}>
                r/productivity
              </span>
              ,{" "}
              <span style={{ color: "#4e7a30", fontWeight: 400 }}>r/ADHD</span>,
              and{" "}
              <span style={{ color: "#4e7a30", fontWeight: 400 }}>
                r/pomodoro
              </span>{" "}
              — 47 threads, 200+ comments. Thematic coding surfaced 3 consistent
              patterns.
            </p>
            {/* Affinity map */}
            <div
              className="cs-reveal"
              style={{
                ...reveal(0.15),
                borderRadius: "12px",
                overflow: "hidden",
                border: "0.5px solid rgba(154,175,122,0.3)",
              }}
            >
              <img
                src="/assets/Fishdoro-SS/Affinity%20Mapping.png"
                alt="Affinity mapping — thematic coding"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.2),
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#9aaf7a",
                textAlign: "center",
              }}
            >
              Flip each card to read the full insight ↓
            </p>
            {/* Flip cards */}
            <div
              className="cs-reveal flex gap-3"
              style={{ ...reveal(0.25), minHeight: "140px" }}
            >
              {INSIGHT_CARDS.map((card, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    perspective: "800px",
                    cursor: "pointer",
                    height: "140px",
                  }}
                  onClick={() => setFlipped(flipped === i ? null : i)}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s ease",
                      transform:
                        flipped === i ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        background: "#ffffff",
                        border: "0.5px solid rgba(154,175,122,0.3)",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#9aaf7a",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {card.frontSub}
                      </span>
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#2d4a1e",
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {card.front}
                      </p>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#b8b0a2",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        click to reveal →
                      </span>
                    </div>
                    {/* Back */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "rgba(200,219,160,0.15)",
                        border: "0.5px solid rgba(107,143,78,0.4)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 300,
                          color: "#5a7040",
                          textAlign: "center",
                          lineHeight: 1.6,
                        }}
                      >
                        {card.back}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
              margin: "40px 0",
            }}
          />

          {/* ── Define ── */}
          <section className="flex flex-col gap-4">
            <div className="cs-reveal" style={reveal(0)}>
              {sectionPill("Define")}
            </div>
            <h2
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              Three design problems
            </h2>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.1),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              The research converged on three root problems — each pointing
              toward the same design direction.
            </p>
            {/* Design problems — each with cs-reveal for scroll reveal effect */}
            <div className="flex flex-col gap-3" style={{ marginTop: "8px" }}>
              {DEFINE_PROBLEMS.map((p, i) => (
                <div
                  key={p.num}
                  className="cs-reveal"
                  style={{
                    ...reveal(i * 0.12),
                    background: "#ffffff",
                    border: "0.5px solid rgba(154,175,122,0.3)",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      color: "#9aaf7a",
                      minWidth: "20px",
                      marginTop: "3px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {p.num}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2d4a1e",
                      }}
                    >
                      {p.problem}
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 300,
                        color: "#5a7040",
                        lineHeight: 1.6,
                      }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Design brief */}
            <div
              className="cs-reveal"
              style={{
                ...reveal(0.36),
                marginTop: "8px",
                borderLeft: "2.5px solid rgba(107,143,78,0.4)",
                paddingLeft: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#9aaf7a",
                  marginBottom: "6px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Design Brief
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "#2d4a1e",
                  lineHeight: 1.5,
                }}
              >
                "Design a focus tool where the reward is part of the experience
                — not external to it."
              </p>
            </div>
          </section>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
              margin: "40px 0",
            }}
          />

          {/* ── Develop ── */}
          <section className="flex flex-col gap-4">
            <div className="cs-reveal" style={reveal(0)}>
              {sectionPill("Develop")}
            </div>
            <h2
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              From brief to build
            </h2>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.1),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              The brief pointed toward a single-screen app: timer, pond, and
              fish inventory all visible at once. No navigation, no dashboards —
              just the act of focusing and its reward in the same frame.
            </p>
            {/* IA + Visual direction cards */}
            <div className="cs-reveal flex gap-3" style={{ ...reveal(0.15) }}>
              {[
                {
                  label: "Information Architecture",
                  value:
                    "Single screen — timer + pond + fish inventory. No navigation required.",
                },
                {
                  label: "Visual Direction",
                  value:
                    "Pixel art, 16-bit palette. Warm earth tones. Intentionally nostalgic and low-stimulation.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    background: "#ffffff",
                    border: "0.5px solid rgba(154,175,122,0.3)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#9aaf7a",
                      marginBottom: "6px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "#5a7040",
                      lineHeight: 1.6,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <h3
              className="cs-reveal"
              style={{
                ...reveal(0.2),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#2d4a1e",
                marginTop: "8px",
              }}
            >
              Iteration — drag to compare
            </h3>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.25),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              Three rounds of iteration. Drag the slider to compare the first
              wireframe with the final hi-fi:
            </p>

            {/* Before/After slider */}
            <div
              ref={sliderRef}
              className="cs-reveal"
              style={{
                ...reveal(0.3),
                position: "relative",
                height: "360px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "0.5px solid rgba(154,175,122,0.3)",
                userSelect: "none",
                cursor: "col-resize",
                background: "#1a1a2e",
              }}
            >
              {/* Before — lo-fi */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/Fishdoro-SS/LoFi-Home-Before.png"
                  alt="Lo-fi wireframe"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>
              {/* After — hi-fi */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#1a1a2e",
                }}
              >
                <img
                  src="/assets/Fishdoro-SS/HiFi-Home.png"
                  alt="Hi-fi home screen"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>
              {/* Drag handle */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${sliderPos}%`,
                  width: "2px",
                  background: "#6b8f4e",
                  transform: "translateX(-50%)",
                  cursor: "ew-resize",
                }}
                onMouseDown={startSliderDrag}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#6b8f4e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(107,143,78,0.3)",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "10px",
                      lineHeight: 1,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ⟺
                  </span>
                </div>
              </div>
            </div>

            <h3
              className="cs-reveal"
              style={{
                ...reveal(0),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#2d4a1e",
                marginTop: "8px",
              }}
            >
              Design outcome — annotated
            </h3>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              Click any numbered point to read the design decision behind it:
            </p>

            {/* Annotated screen viewer */}
            <div
              className="cs-reveal"
              style={{
                ...reveal(0.1),
                position: "relative",
                borderRadius: "12px",
                border: "0.5px solid rgba(154,175,122,0.3)",
                background: "#1a1a2e",
              }}
            >
              <img
                src="/assets/Fishdoro-SS/HiFi-Pomodoro-Session.png"
                alt="Hi-fi focus session"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {/* Hotspot overlay — positioned relative to natural image size */}
              {FISHDORO_ANNOTATIONS.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    position: "absolute",
                    left: `${ann.x}%`,
                    top: `${ann.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                  }}
                >
                  <button
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background:
                        activeAnnotation === ann.id ? "#6b8f4e" : "#ffffff",
                      border: "1.5px solid #6b8f4e",
                      color:
                        activeAnnotation === ann.id ? "#ffffff" : "#6b8f4e",
                      fontSize: "10px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Inter, sans-serif",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() =>
                      setActiveAnnotation(
                        activeAnnotation === ann.id ? null : ann.id,
                      )
                    }
                  >
                    {ann.id}
                  </button>
                  {activeAnnotation === ann.id && (
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        ...(ann.y > 55
                          ? { bottom: "calc(100% + 8px)" }
                          : { top: "calc(100% + 8px)" }),
                        transform: "translateX(-50%)",
                        zIndex: 20,
                        background: "#ffffff",
                        border: "0.5px solid rgba(154,175,122,0.4)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        width: "200px",
                        pointerEvents: "none",
                        boxShadow: "0 4px 16px rgba(45,74,30,0.08)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "#2d4a1e",
                          marginBottom: "4px",
                        }}
                      >
                        {ann.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 300,
                          color: "#5a7040",
                          lineHeight: 1.5,
                        }}
                      >
                        {ann.desc}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hi-fi screen grid */}
            <div
              className="cs-reveal"
              style={{
                ...reveal(0.15),
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {[
                {
                  src: "/assets/Fishdoro-SS/HiFi-Session-Setup.png",
                  caption: "Session setup",
                },
                {
                  src: "/assets/Fishdoro-SS/HiFi-Catch-Log.png",
                  caption: "Catch log",
                },
                {
                  src: "/assets/Fishdoro-SS/HiFi-Session-Setting.png",
                  caption: "Session settings",
                },
                {
                  src: "/assets/Fishdoro-SS/HiFi-Catch-Report.png",
                  caption: "Catch report",
                },
              ].map((s) => (
                <div
                  key={s.src}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "0.5px solid rgba(154,175,122,0.3)",
                      background: "#1a1a2e",
                    }}
                  >
                    <img
                      src={s.src}
                      alt={s.caption}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 300,
                      color: "#9aaf7a",
                      textAlign: "center",
                      fontStyle: "italic",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {s.caption}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
              margin: "40px 0",
            }}
          />

          {/* ── Validation ── */}
          <section className="flex flex-col gap-4">
            <div className="cs-reveal" style={reveal(0)}>
              {sectionPill("Validation")}
            </div>
            <h2
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              Testing & open questions
            </h2>
            <p
              className="cs-reveal"
              style={{
                ...reveal(0.1),
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#5a7040",
                lineHeight: 1.7,
              }}
            >
              Core build is functional. Currently running informal user testing
              (n=3 sessions) with people who actively use Pomodoro systems.
            </p>
            <div
              className="cs-reveal"
              style={{
                ...reveal(0.15),
                background: "#ffffff",
                border: "0.5px solid rgba(154,175,122,0.3)",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9aaf7a",
                  marginBottom: "12px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Questions still open
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Does the fishing mechanic actually reduce the guilt spiral effect, or does it introduce new pressure to "complete" sessions?',
                  "Is the pixel art aesthetic accessible to users who don't have nostalgia for that era?",
                  "How do extended sessions (4+ hours) feel? Does fish accumulation stay meaningful or start to feel hollow?",
                ].map((q, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#9aaf7a",
                        marginTop: "2px",
                        minWidth: "14px",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      →
                    </span>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 300,
                        color: "#5a7040",
                        lineHeight: 1.6,
                      }}
                    >
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
              margin: "40px 0",
            }}
          />

          {/* ── Key Takeaways ── */}
          <section className="flex flex-col gap-4">
            <div className="cs-reveal" style={reveal(0)}>
              {sectionPill("Key Takeaways")}
            </div>
            <h2
              className="cs-reveal"
              style={{
                ...reveal(0.05),
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              4 things this project taught me
            </h2>
            <div className="flex flex-col gap-3">
              {KEY_TAKEAWAYS.map((item, i) => (
                <div
                  key={item.num}
                  className="cs-reveal"
                  style={{
                    ...reveal(i * 0.1),
                    background: "#ffffff",
                    border: "0.5px solid rgba(154,175,122,0.3)",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "rgba(154,175,122,0.5)",
                      minWidth: "28px",
                      lineHeight: 1,
                    }}
                  >
                    {item.num}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2d4a1e",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 300,
                        color: "#5a7040",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ height: "40px" }} />
        </div>
      </div>
    </div>
  );
}

function ProjectPage({
  onClose,
  origin,
  isClosing: forcedClosing,
}: {
  onClose: () => void;
  origin: { x: number; y: number } | null;
  isClosing?: boolean;
}) {
  const [closing, setClosing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }

  const isClosing = closing || forcedClosing;
  const transformOrigin = origin
    ? `${origin.x}px ${origin.y}px`
    : "center center";

  return (
    <div
      className={`absolute inset-6 z-20 rounded-2xl flex flex-col overflow-hidden shadow-xl ${isClosing ? "mac-close" : "mac-open"}`}
      style={{ transformOrigin, background: "#FAF7F2" }}
    >
      {/* Window chrome / topbar */}
      <div
        className="flex items-center gap-3 px-6 py-3 shrink-0"
        style={{
          borderBottom: "0.5px solid rgba(154,175,122,0.2)",
          background: "#FAF7F2",
        }}
      >
        <div className="flex items-center gap-[5px]">
          <button
            onClick={handleClose}
            title="Close"
            className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90
              transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
            aria-label="Close"
          >
            <svg
              className="w-[6px] h-[6px] opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
              viewBox="0 0 8 8"
              fill="none"
              stroke="#7A0000"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="7" y2="7" />
              <line x1="7" y1="1" x2="1" y2="7" />
            </svg>
          </button>
          <span
            className="w-[10px] h-[10px] rounded-full bg-[#D9D9D9]"
            title="Minimize"
          />
          <span
            className="w-[10px] h-[10px] rounded-full bg-[#D9D9D9]"
            title="Maximize"
          />
        </div>
        {selectedCase ? (
          <>
            <button
              onClick={() => setSelectedCase(null)}
              className="text-[14px] font-normal select-none transition-colors duration-150"
              style={{
                color: "#9aaf7a",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#6b8f4e";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#9aaf7a";
              }}
            >
              Project
            </button>
            <span
              className="text-[14px] font-normal select-none"
              style={{ color: "#9aaf7a" }}
            >
              /
            </span>
            <span
              className="text-[14px] font-medium select-none"
              style={{ color: "#2d4a1e" }}
            >
              Fishdoro
            </span>
          </>
        ) : (
          <>
            <span
              className="text-[14px] font-medium select-none"
              style={{ color: "#2d4a1e" }}
            >
              Project
            </span>
            <span
              className="text-[14px] font-normal select-none"
              style={{ color: "#9aaf7a" }}
            >
              My works
            </span>
          </>
        )}
      </div>

      {/* Content area: case study or project grid */}
      {selectedCase === "fishdoro" ? (
        <FishdoroCaseStudy onBack={() => setSelectedCase(null)} />
      ) : (
        <div className="overflow-y-auto px-6 py-5 scrollbar-hide flex-1">
          {/* Two independent columns — align-items: start behaviour: each col is its own flex column */}
          <div className="flex gap-4 items-start">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-4 flex-1">
                {PROJECT_ITEMS.filter((_, i) => i % 2 === col).map((p) => (
                  <article
                    key={p.num}
                    className="overflow-hidden transition-all duration-200"
                    style={{
                      background: "#ffffff",
                      border: "0.5px solid rgba(154,175,122,0.3)",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (p.caseStudy) {
                        setSelectedCase(p.caseStudy);
                        setHoveredCard(null);
                        window.dispatchEvent(
                          new CustomEvent("project-cursor", {
                            detail: { active: false },
                          }),
                        );
                      }
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(107,143,78,0.5)";
                      setHoveredCard(p.num);
                      window.dispatchEvent(
                        new CustomEvent("project-cursor", {
                          detail: { active: true },
                        }),
                      );
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(154,175,122,0.3)";
                      setHoveredCard(null);
                      window.dispatchEvent(
                        new CustomEvent("project-cursor", {
                          detail: { active: false },
                        }),
                      );
                    }}
                  >
                    {/* Cover image area */}
                    <div
                      className="w-full overflow-hidden flex items-center justify-center"
                      style={{
                        height: "200px",
                        background: "#e8e2d8",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        className="text-[12px] font-light select-none tracking-wide"
                        style={{ color: "#b8b0a2" }}
                      >
                        Cover Image
                      </span>
                    </div>

                    {/* Card body — always visible */}
                    <div className="px-4 pt-[14px] pb-[14px] flex flex-col gap-[6px]">
                      <div className="flex items-start justify-between gap-[10px]">
                        <h2
                          className="text-[16px] font-medium leading-[1.3] select-none"
                          style={{ color: "#2d4a1e" }}
                        >
                          {p.title}
                        </h2>
                        <div className="flex gap-[5px] flex-wrap shrink-0">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[12px] font-normal rounded-full px-[10px] py-[3px] whitespace-nowrap select-none"
                              style={{
                                color: "#4e7a30",
                                background: "rgba(200,219,160,0.3)",
                                border: "0.5px solid rgba(107,143,78,0.3)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p
                        className="text-[14px] font-light leading-[1.5] select-none"
                        style={{ color: "#5a7040" }}
                      >
                        {p.desc}
                      </p>
                    </div>

                    {/* Expanded section — hover expand (behavior preserved) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${hoveredCard === p.num ? "max-h-52 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <hr
                        className="mx-4"
                        style={{
                          border: "none",
                          borderTop: "0.5px solid rgba(154,175,122,0.25)",
                          marginBottom: "12px",
                        }}
                      />
                      <div className="px-4 pb-4 flex flex-col gap-3">
                        {[
                          { label: "Role", value: p.role },
                          { label: "Team", value: p.team },
                          { label: "Timeframe", value: p.timeframe },
                        ].map((row) => (
                          <div key={row.label} className="flex items-start">
                            <span
                              className="text-[10px] font-medium uppercase tracking-[0.1em] shrink-0 select-none"
                              style={{ color: "#9aaf7a", width: "80px" }}
                            >
                              {row.label}
                            </span>
                            <span
                              className="text-[14px] font-light select-none"
                              style={{ color: "#5a7040" }}
                            >
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── About Me Page ────────────────────────────────────────────────────────────
const ABOUT_EXPERIENCE = [
  {
    period: "May 2020 – Present",
    company: "Fiverr Platform",
    role: "Freelance Illustrator and Animator",
    desc: "Completed 150+ illustration and animation projects for international clients, specializing in hand-drawn and pixel art. Built strong client relationships through reliable delivery, clear communication, and consistent quality across diverse project scopes.",
    highlight: null,
  },
  {
    period: "Jun 2022 – Nov 2022",
    company: "Cuatrodia Creative",
    role: "Intern 2D Motion Artist",
    desc: "Assisted in developing 2D animations for short films, event visuals, and promotional materials. Contributed to the opening animation showcased at the",
    highlight: "2022 G20 Summit in Bali",
    highlightSuffix:
      ", supporting the branding of a high-profile international event.",
  },
  {
    period: "Aug 2021 – Dec 2021",
    company: "Zenius Education",
    role: "Intern Storyboard Artist",
    desc: "Created storyboards and thumbnails for Zenius Education's original educational series, ensuring engaging and effective visual storytelling. Translated complex academic topics into accessible narratives for primary and secondary school audiences, while also mentoring fellow interns by providing feedback and suggestions to improve overall team quality.",
    highlight: null,
  },
  {
    period: "Sep 2020 – Dec 2021",
    company: "MSV Studio",
    role: "Junior 2D Animator",
    desc: "Completed a 9-month internship specializing in 2D animation techniques, cut-out workflows, and production pipelines. Continued as a contract 2D animator for 3 months, delivering high-quality animation assets for client projects under tight deadlines.",
    highlight: null,
  },
];

const ABOUT_ORGS = [
  {
    period: "Sep 2020 – Dec 2021",
    company: "Amikom Computer Club",
    role: "",
    desc: "Collaborated with a team of five to maintain design consistency across Instagram, Twitter, and LinkedIn. Conducted workshops for new members, introducing fundamental front-end development concepts and design tools. Also managed public relations and documented campus events to boost organizational visibility.",
  },
];

const ABOUT_COURSES = [
  {
    period: "Feb 2025 – Aug 2025",
    company: "Harisenin.com",
    role: "UX Design Bootcamp",
    desc: "Completed a comprehensive UX design bootcamp focused on UX research and product management. As the final project, conducted UX research and design for a Finance Tracking App for Young Adults, covering the full process from research methods and persona building to UI design, wireframing, prototyping, and Figma.",
  },
  {
    period: "Jan 2025 – Jun 2025",
    company: "Uxcel",
    role: "UI/UX Design Courses",
    desc: "Completed multiple UI/UX design courses to build a strong foundation in design principles and practical skills. Topics included UX foundations, UI components, accessibility, common design patterns, wireframing, design terminology, composition, color psychology, and typography.",
  },
];

const TESTIMONIALS = [
  {
    name: "Akraal",
    country: "Sweden",
    flag: "🇸🇪",
    initial: "A",
    text: "Really great experience working with Fitri Zahwa. The delivery took a bit longer, but it was absolutely worth the wait. She was professional, friendly, and handled the whole process in a very smooth and respectful way. What I appreciated most was her willingness to step outside her comfort zone for this project, and she still delivered with real quality and care. Very happy with the final result, and I'd gladly work with her again.",
  },
  {
    name: "aubinrauffet671",
    country: "France",
    flag: "🇫🇷",
    initial: "A",
    text: "I had the pleasure of working with Fitri, and I'm beyond impressed! From start to finish, Fitri was an excellent communicator, always engaging with me to ensure every detail was perfect. They went above and beyond to make sure the final result exceeded my expectations. Truly a dedicated and talented professional who is committed to delivering the best work possible. Highly recommend! Thank you for the great work!",
  },
  {
    name: "Aleynatuna",
    country: "Turkey",
    flag: "🇹🇷",
    initial: "A",
    text: "It was very easy to communicate with her. Although we did not agree on exactly what I wanted at first, when I explained it again, she understood what I was expecting from the work very well and made the drawing I wanted extremely good. She was very polite and understanding in every conversation we had. I am also pleased with how detailed the drawing is. I am happy to work with her, I am sure that our work will continue.",
  },
];

function TimelineItem({
  period,
  company,
  role,
  desc,
}: {
  period: string;
  company: string;
  role: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-baseline justify-between gap-4">
        <p
          className="text-[18px] font-medium select-none"
          style={{ color: "#2d4a1e" }}
        >
          {company}
        </p>
        <span
          className="text-[14px] font-light shrink-0 select-none"
          style={{ color: "#9aaf7a", whiteSpace: "nowrap" }}
        >
          {period}
        </span>
      </div>
      {role && (
        <p
          className="text-[16px] font-light select-none"
          style={{ color: "#6b8f4e" }}
        >
          {role}
        </p>
      )}
      <p
        className="text-[16px] font-light leading-[1.7] select-none"
        style={{ color: "#5a7040" }}
      >
        {desc}
      </p>
    </div>
  );
}

function AboutPage({
  onClose,
  origin,
  isClosing: forcedClosing,
}: {
  onClose: () => void;
  origin: { x: number; y: number } | null;
  isClosing?: boolean;
}) {
  const [closing, setClosing] = useState(false);
  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }
  const isClosing = closing || forcedClosing;
  const transformOrigin = origin
    ? `${origin.x}px ${origin.y}px`
    : "center center";

  return (
    <div
      className={`absolute inset-6 z-20 rounded-2xl flex flex-col overflow-hidden shadow-xl ${isClosing ? "mac-close" : "mac-open"}`}
      style={{ transformOrigin, background: "#FAF7F2" }}
    >
      {/* Window chrome / topbar */}
      <div
        className="flex items-center gap-3 px-6 py-3 shrink-0"
        style={{
          borderBottom: "0.5px solid rgba(154,175,122,0.2)",
          background: "#FAF7F2",
        }}
      >
        <div className="flex items-center gap-[5px]">
          <button
            onClick={handleClose}
            title="Close"
            className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90 transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
            aria-label="Close"
          >
            <svg
              className="w-[6px] h-[6px] opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
              viewBox="0 0 8 8"
              fill="none"
              stroke="#7A0000"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="7" y2="7" />
              <line x1="7" y1="1" x2="1" y2="7" />
            </svg>
          </button>
          <span
            className="w-[10px] h-[10px] rounded-full bg-[#D9D9D9]"
            title="Minimize"
          />
          <span
            className="w-[10px] h-[10px] rounded-full bg-[#D9D9D9]"
            title="Maximize"
          />
        </div>
        <span
          className="text-[14px] font-medium select-none"
          style={{ color: "#2d4a1e" }}
        >
          About Me
        </span>
        <span
          className="text-[14px] font-normal select-none"
          style={{ color: "#9aaf7a" }}
        >
          Who I am
        </span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-[640px] mx-auto px-8 py-12 flex flex-col gap-10">
          {/* ── Quote ── */}
          <div className="flex flex-col gap-4">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.14em] select-none"
              style={{ color: "#9aaf7a" }}
            >
              Steve Jobs once said...
            </p>
            <blockquote
              className="pl-4"
              style={{ borderLeft: "2.5px solid rgba(107,143,78,0.4)" }}
            >
              <p
                className="text-[20px] italic leading-[1.5] select-none"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  color: "#2d4a1e",
                }}
              >
                "Design is not just what it looks like and feels like. Design is
                how it works."
              </p>
            </blockquote>
            <p
              className="text-[16px] font-light leading-[1.7] select-none"
              style={{ color: "#5a7040" }}
            >
              They remind me that design lives in how people experience it, and
              that's what eventually led me to UI/UX.
            </p>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
            }}
          />

          {/* ── Bio ── */}
          <div className="flex flex-col gap-3">
            <p
              className="text-[18px] font-medium leading-[1.6] select-none"
              style={{ color: "#2d4a1e" }}
            >
              Hi, I'm Fitri Zahwa Januarita, a former illustrator and animator
              who found a new purpose in UI/UX design.
            </p>
            <p
              className="text-[16px] font-light leading-[1.8] select-none"
              style={{ color: "#5a7040" }}
            >
              I've been drawing since I was a kid and even earned from it in
              high school. But over time, something felt missing — the joy of
              creating started to fade. I wanted my work to matter again. That's
              when I discovered UI/UX. It changed how I see design — not just as
              aesthetics, but as clarity, connection, and impact.
            </p>
            <p
              className="text-[16px] font-light leading-[1.8] select-none"
              style={{ color: "#5a7040" }}
            >
              My attention to detail, which once slowed me down, now helps me
              craft thoughtful and meaningful experiences. I design from
              real-life struggles. My projects,{" "}
              <strong className="font-medium" style={{ color: "#2d4a1e" }}>
                Nabu
              </strong>{" "}
              (a finance tracker) and{" "}
              <strong className="font-medium" style={{ color: "#2d4a1e" }}>
                Fishdoro
              </strong>{" "}
              (a cozy focus timer), are built to help people facing challenges
              similar to mine.
            </p>
            <p
              className="text-[16px] font-light leading-[1.8] select-none"
              style={{ color: "#5a7040" }}
            >
              I still tell stories, only now they're about users, their needs,
              and how design can make their lives better.
            </p>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
            }}
          />

          {/* ── Experience ── */}
          <div className="flex flex-col gap-7">
            <div className="flex justify-center">
              <span
                className="inline-block text-[12px] font-normal select-none"
                style={{
                  color: "#4e7a30",
                  background: "rgba(200,219,160,0.25)",
                  border: "1px solid rgba(107,143,78,0.35)",
                  borderRadius: "99px",
                  padding: "5px 16px",
                }}
              >
                Experience
              </span>
            </div>
            <div className="flex flex-col gap-6">
              {ABOUT_EXPERIENCE.map((item) => (
                <TimelineItem
                  key={item.company + item.period}
                  period={item.period}
                  company={item.company}
                  role={item.role}
                  desc={item.desc}
                />
              ))}
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
            }}
          />

          {/* ── Organization ── */}
          <div className="flex flex-col gap-7">
            <div className="flex justify-center">
              <span
                className="inline-block text-[12px] font-normal select-none"
                style={{
                  color: "#4e7a30",
                  background: "rgba(200,219,160,0.25)",
                  border: "1px solid rgba(107,143,78,0.35)",
                  borderRadius: "99px",
                  padding: "5px 16px",
                }}
              >
                Organization
              </span>
            </div>
            <div className="flex flex-col gap-6">
              {ABOUT_ORGS.map((item) => (
                <TimelineItem
                  key={item.company}
                  period={item.period}
                  company={item.company}
                  role={item.role}
                  desc={item.desc}
                />
              ))}
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
            }}
          />

          {/* ── Courses & Certifications ── */}
          <div className="flex flex-col gap-7">
            <div className="flex justify-center">
              <span
                className="inline-block text-[12px] font-normal select-none"
                style={{
                  color: "#4e7a30",
                  background: "rgba(200,219,160,0.25)",
                  border: "1px solid rgba(107,143,78,0.35)",
                  borderRadius: "99px",
                  padding: "5px 16px",
                }}
              >
                Courses, Training & Certifications
              </span>
            </div>
            <div className="flex flex-col gap-6">
              {ABOUT_COURSES.map((item) => (
                <TimelineItem
                  key={item.company}
                  period={item.period}
                  company={item.company}
                  role={item.role}
                  desc={item.desc}
                />
              ))}
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
            }}
          />

          {/* ── Testimonials ── */}
          <div className="flex flex-col gap-5">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.14em] select-none"
              style={{ color: "#9aaf7a" }}
            >
              That's what they said 🩷
            </p>
            <div className="flex flex-col gap-[14px]">
              {TESTIMONIALS.map((t) => (
                <a
                  key={t.name}
                  href="https://www.fiverr.com/fitrizahwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-3 cursor-pointer select-none transition-all duration-200"
                  style={{
                    background: "#ffffff",
                    border: "0.5px solid rgba(154,175,122,0.3)",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(107,143,78,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(154,175,122,0.3)";
                  }}
                >
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        style={{ fill: "#e8b94a" }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    className="text-[16px] font-light italic leading-[1.7] select-none"
                    style={{ color: "#5a7040" }}
                  >
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#e8dfd4",
                        border: "0.5px solid rgba(154,175,122,0.3)",
                      }}
                    >
                      <span
                        className="text-[12px] font-medium select-none"
                        style={{ color: "#6b8f4e" }}
                      >
                        {t.initial}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-[16px] font-medium select-none"
                        style={{ color: "#2d4a1e" }}
                      >
                        {t.name}
                      </span>
                      <span
                        className="text-[14px] font-light select-none"
                        style={{ color: "#9aaf7a" }}
                      >
                        {t.flag} {t.country}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <span
                        className="text-[12px] font-light"
                        style={{ color: "#9aaf7a" }}
                      >
                        via Fiverr
                      </span>
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#9aaf7a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <a
              href="https://www.fiverr.com/fitrizahwa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 transition-all duration-200"
              style={{
                borderRadius: "99px",
                border: "1px solid rgba(107,143,78,0.35)",
                color: "#9aaf7a",
                fontSize: "14px",
                fontWeight: 300,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(200,219,160,0.15)";
                (e.currentTarget as HTMLElement).style.color = "#4e7a30";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color = "#9aaf7a";
              }}
            >
              <span>See all reviews on Fiverr</span>
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" />
              </svg>
            </a>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid rgba(154,175,122,0.25)",
            }}
          />

          {/* ── Read ── */}
          <div className="flex flex-col gap-4">
            <h2
              className="text-[10px] font-medium uppercase tracking-[0.14em] select-none"
              style={{ color: "#9aaf7a" }}
            >
              Read
            </h2>
            <a
              href="https://fitrizahwa-garden.framer.website/reading"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 overflow-hidden transition-all duration-200"
              style={{
                borderRadius: "12px",
                border: "0.5px solid rgba(154,175,122,0.3)",
                background: "#ffffff",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(107,143,78,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(154,175,122,0.3)";
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[20px]">📚</span>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[14px] font-medium select-none"
                    style={{ color: "#2d4a1e" }}
                  >
                    Fitri's Garden
                  </span>
                  <span
                    className="text-[12px] font-light select-none"
                    style={{ color: "#9aaf7a" }}
                  >
                    Reading list & notes
                  </span>
                </div>
              </div>
              <span style={{ color: "#9aaf7a", fontSize: "18px" }}>↗</span>
            </a>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

// ─── Visitor Gallery Data ────────────────────────────────────────────────────
type BloomEntry = {
  id: number;
  num: string;
  name: string;
  flower: string;
  flowerName: string;
  message: string;
  date: string;
  x: number;
  y: number;
};

const BLOOM_DATA: BloomEntry[] = [
  {
    id: 1,
    num: "1948",
    name: "Fikri",
    flower: "daisy",
    flowerName: "Daisy Love",
    message: "Keep going, keep growing. ✨",
    date: "Apr 16, 2025",
    x: 56,
    y: 36,
  },
  {
    id: 2,
    num: "1947",
    name: "Rania",
    flower: "sakura",
    flowerName: "Sakura Bloom",
    message: "Thank you for creating such a lovely space 🌸",
    date: "Apr 18, 2025",
    x: 24,
    y: 18,
  },
  {
    id: 3,
    num: "1946",
    name: "Dinda",
    flower: "lavender",
    flowerName: "Lavender",
    message: "Peace begins with a grateful heart 💜",
    date: "Apr 17, 2025",
    x: 62,
    y: 14,
  },
  {
    id: 4,
    num: "1945",
    name: "Arman",
    flower: "sunflower",
    flowerName: "Sunflower",
    message: "Be like a sunflower, follow the light 🌻",
    date: "Apr 15, 2025",
    x: 76,
    y: 50,
  },
  {
    id: 5,
    num: "1944",
    name: "Nabila",
    flower: "forgetmenot",
    flowerName: "Forget-me-not",
    message: "Small flowers, big memories 💙",
    date: "Apr 15, 2025",
    x: 16,
    y: 58,
  },
  {
    id: 6,
    num: "1943",
    name: "Alya",
    flower: "rose",
    flowerName: "Rose",
    message: "Every petal tells a story 🌹",
    date: "Apr 14, 2025",
    x: 70,
    y: 68,
  },
  {
    id: 7,
    num: "1942",
    name: "Budi",
    flower: "daisy",
    flowerName: "Daisy Love",
    message: "Keep blooming! 🌼",
    date: "Apr 13, 2025",
    x: 38,
    y: 64,
  },
  {
    id: 8,
    num: "1941",
    name: "Sari",
    flower: "sakura",
    flowerName: "Sakura Bloom",
    message: "You inspire me always 🌸",
    date: "Apr 12, 2025",
    x: 10,
    y: 30,
  },
  {
    id: 9,
    num: "1940",
    name: "Yoga",
    flower: "cosmos",
    flowerName: "Cosmos",
    message: "Dreaming in flowers 🌸",
    date: "Apr 11, 2025",
    x: 85,
    y: 26,
  },
  {
    id: 10,
    num: "1939",
    name: "Putri",
    flower: "lavender",
    flowerName: "Lavender",
    message: "Serenity in every bloom 🌿",
    date: "Apr 10, 2025",
    x: 46,
    y: 22,
  },
  {
    id: 11,
    num: "1938",
    name: "Hana",
    flower: "rose",
    flowerName: "Rose",
    message: "A garden of kindness 🌹",
    date: "Apr 9, 2025",
    x: 30,
    y: 72,
  },
  {
    id: 12,
    num: "1937",
    name: "Dito",
    flower: "forgetmenot",
    flowerName: "Forget-me-not",
    message: "Always remember to smile 💙",
    date: "Apr 8, 2025",
    x: 84,
    y: 60,
  },
];

const FLOWER_NAMES: Record<string, string> = {
  sakura: "Sakura Bloom",
  lavender: "Lavender",
  daisy: "Daisy Love",
  sunflower: "Sunflower",
  babysbreath: "Baby's Breath",
  forgetmenot: "Forget-me-not",
  cosmos: "Cosmos",
  rose: "Rose",
};

function rowToBloomEntry(e: BloomRow, i = 0): BloomEntry {
  return {
    id: e.id,
    num: e.visitor_num ?? "?",
    name: e.name,
    flower: e.flower,
    flowerName: FLOWER_NAMES[e.flower] ?? e.flower,
    message: e.message ?? "",
    date: e.date ?? "",
    x: typeof e.x === "number" ? e.x : 50,
    y: typeof e.y === "number" ? e.y : 50,
  };
  void i;
}

function FlowerSvg({ type, size = 64 }: { type: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none" as const,
    style: { overflow: "visible" as const },
  };

  switch (type) {
    case "sakura":
      return (
        <svg {...common}>
          <g transform="translate(24,24)">
            {[0, 72, 144, 216, 288].map((r) => (
              <path
                key={r}
                d="M0,0 Q-5,-2 -3,-10 L0,-13 L3,-10 Q5,-2 0,0 Z"
                fill="#e8a0bc"
                opacity="0.85"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#f9d0e0" opacity="0.95" />
            <circle cx="0" cy="0" r="1.5" fill="#e8a0bc" opacity="0.5" />
          </g>
        </svg>
      );
    case "lavender":
      return (
        <svg {...common}>
          <line
            x1="24"
            y1="44"
            x2="24"
            y2="12"
            stroke="#6a8f45"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse
            cx="24"
            cy="20"
            rx="3.5"
            ry="5"
            fill="#9b86d4"
            opacity="0.8"
          />
          <ellipse
            cx="24"
            cy="14"
            rx="3"
            ry="4.5"
            fill="#8b76c8"
            opacity="0.85"
          />
          <ellipse
            cx="24"
            cy="9"
            rx="2.5"
            ry="3.5"
            fill="#7b68c4"
            opacity="0.9"
          />
        </svg>
      );
    case "sunflower":
      return (
        <svg {...common}>
          <g transform="translate(24,18)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
              <ellipse
                key={r}
                cx="0"
                cy="-10"
                rx="3.5"
                ry="7"
                fill="#f0c030"
                opacity="0.88"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="6.5" fill="#7a4a10" />
            <circle cx="0" cy="0" r="4.5" fill="#5a3008" />
          </g>
          <line
            x1="24"
            y1="42"
            x2="24"
            y2="24"
            stroke="#6a8f45"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "babysbreath":
      return (
        <svg {...common}>
          <line
            x1="24"
            y1="42"
            x2="24"
            y2="28"
            stroke="#7a9a55"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="32"
            x2="15"
            y2="22"
            stroke="#7a9a55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="30"
            x2="33"
            y2="20"
            stroke="#7a9a55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="28"
            x2="19"
            y2="16"
            stroke="#7a9a55"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="28"
            x2="29"
            y2="14"
            stroke="#7a9a55"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle
            cx="15"
            cy="21"
            r="2.5"
            fill="white"
            stroke="#d0c8d8"
            strokeWidth="0.8"
          />
          <circle
            cx="33"
            cy="19"
            r="2.5"
            fill="white"
            stroke="#d0c8d8"
            strokeWidth="0.8"
          />
          <circle
            cx="19"
            cy="15"
            r="2"
            fill="white"
            stroke="#d0c8d8"
            strokeWidth="0.8"
          />
          <circle
            cx="29"
            cy="13"
            r="2"
            fill="white"
            stroke="#d0c8d8"
            strokeWidth="0.8"
          />
          <circle
            cx="24"
            cy="11"
            r="1.8"
            fill="white"
            stroke="#d0c8d8"
            strokeWidth="0.8"
          />
        </svg>
      );
    case "forgetmenot":
      return (
        <svg {...common}>
          <g transform="translate(16,22)">
            {[0, 72, 144, 216, 288].map((r) => (
              <circle
                key={r}
                cx="0"
                cy="-6"
                r="3.5"
                fill="#80aee0"
                opacity="0.85"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="2.2" fill="#fff7c0" />
          </g>
          <g transform="translate(32,28)">
            {[0, 72, 144, 216, 288].map((r) => (
              <circle
                key={r}
                cx="0"
                cy="-5"
                r="2.8"
                fill="#6898d0"
                opacity="0.8"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="1.8" fill="#fff7c0" />
          </g>
          <line
            x1="24"
            y1="42"
            x2="16"
            y2="32"
            stroke="#6a8f45"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="32"
            x2="16"
            y2="24"
            stroke="#6a8f45"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="30"
            x2="30"
            y2="26"
            stroke="#6a8f45"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cosmos":
      return (
        <svg {...common}>
          <g transform="translate(24,20)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
              <path
                key={r}
                d="M0,2 C-6,1 -10,-6 -5,-12 C-3,-15 3,-15 5,-12 C10,-6 6,1 0,2 Z"
                fill="#e090a8"
                opacity="0.8"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="4" fill="#f0c038" />
            <circle cx="0" cy="0" r="2.5" fill="#e6a820" />
          </g>
          <line
            x1="24"
            y1="40"
            x2="24"
            y2="26"
            stroke="#6a8f45"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "rose":
      return (
        <svg {...common}>
          <g transform="translate(24,22)">
            {[0, 72, 144, 216, 288].map((r) => (
              <path
                key={r}
                d="M0,2 C-7,0 -9,-9 -4,-14 C-2,-16 2,-16 4,-14 C9,-9 7,0 0,2 Z"
                fill="#e06080"
                opacity="0.55"
                transform={`rotate(${r})`}
              />
            ))}
            {[20, 140, 260].map((r) => (
              <path
                key={r}
                d="M0,1 C-4,0 -6,-6 -2,-9 C0,-10 2,-10 2,-9 C6,-6 4,0 0,1 Z"
                fill="#d04868"
                opacity="0.9"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#c03055" />
          </g>
          <line
            x1="24"
            y1="40"
            x2="24"
            y2="28"
            stroke="#4a7a30"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "daisy":
    default:
      return (
        <svg {...common}>
          <g transform="translate(24,20)">
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((r) => (
              <ellipse
                key={r}
                cx="0"
                cy="-9"
                rx="3"
                ry="6.5"
                fill="white"
                opacity="0.9"
                transform={`rotate(${r})`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#f0c030" opacity="0.95" />
            <circle cx="0" cy="0" r="3" fill="#e6a820" />
          </g>
          <line
            x1="24"
            y1="40"
            x2="24"
            y2="28"
            stroke="#6a8f45"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

// ─── Visitor Gallery Page ─────────────────────────────────────────────────────
function VisitorGalleryPage({
  onClose,
  isClosing: forcedClosing,
}: {
  onClose: () => void;
  isClosing?: boolean;
}) {
  const [closing, setClosing] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [blooms, setBlooms] = useState<BloomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Fetch real visitor blooms from Supabase on mount (show more blooms, but count all)
  useEffect(() => {
    // Fetch total count
    supabase
      .from("blooms")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        setTotalCount(count ?? 0);
      });
    // Fetch latest blooms to display
    supabase
      .from("blooms")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120)
      .then(({ data, error }) => {
        if (!error && data) {
          setBlooms((data as BloomRow[]).map(rowToBloomEntry));
        }
        setLoading(false);
      });
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }
  const isClosing = closing || forcedClosing;

  return (
    <div
      className={`absolute inset-6 z-20 rounded-2xl flex flex-col overflow-hidden shadow-xl ${isClosing ? "mac-close" : "mac-open"}`}
      style={{ transformOrigin: "center center", background: "#FAF7F2" }}
    >
      {/* ── Window chrome ──────────────────────────────────────────────── */}
      <div
        className="flex items-center shrink-0 px-6 py-3"
        style={{ borderBottom: "0.5px solid rgba(154,175,122,0.2)" }}
      >
        <div className="flex items-center gap-[5px]">
          <button
            onClick={handleClose}
            title="Close"
            className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90 transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
            aria-label="Close"
          >
            <svg
              className="w-1.5 h-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
              viewBox="0 0 8 8"
              fill="none"
              stroke="#7A0000"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="7" y2="7" />
              <line x1="7" y1="1" x2="1" y2="7" />
            </svg>
          </button>
          <span
            className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E]"
            title="Minimize"
          />
          <span
            className="w-[10px] h-[10px] rounded-full bg-[#28C840]"
            title="Maximize"
          />
        </div>
        <span
          className="ml-4 text-[14px] font-medium select-none"
          style={{ color: "#2d4a1e", fontFamily: "Inter, sans-serif" }}
        >
          Visitor Gallery
        </span>
        <span
          className="ml-3 text-[14px] font-normal select-none"
          style={{ color: "#9aaf7a", fontFamily: "Inter, sans-serif" }}
        >
          Bloomed with love 🌿
        </span>
        <div className="ml-auto">
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 select-none transition-all duration-200"
            style={{
              border: "1px solid #6b8f4e",
              borderRadius: "99px",
              background: "rgba(250,247,242,0.5)",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "#2d4a1e",
            }}
          >
            <span>🌿</span>
            <span>My corner</span>
          </button>
        </div>
      </div>

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex items-center px-6 pt-4 pb-3 shrink-0">
        <h2
          className="text-[20px] font-medium select-none"
          style={{ color: "#2d4a1e", fontFamily: "Inter, sans-serif" }}
        >
          Visitor Gallery
        </h2>
        <span
          className="ml-3 text-[12px] select-none"
          style={{
            color: "#4e7a30",
            background: "rgba(200,219,160,0.3)",
            border: "0.5px solid rgba(107,143,78,0.3)",
            borderRadius: "99px",
            padding: "3px 12px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          }}
        >
          {loading
            ? "Loading…"
            : `${totalCount ?? blooms.length} bloom${(totalCount ?? blooms.length) !== 1 ? "s" : ""} planted`}
        </span>
      </div>

      {/* ── Main body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden gap-3 px-6 pb-0 min-h-0 relative">
        {/* Loading overlay */}
        {loading && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl"
            style={{
              background: "rgba(250,247,242,0.88)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="flex items-end gap-1.5">
              {[0, 0.15, 0.3].map((delay, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "#9aaf7a",
                    animation: `vg-bounce 0.9s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
            <p
              className="text-[11px] tracking-widest uppercase font-medium select-none"
              style={{
                color: "#9aaf7a",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Growing the garden…
            </p>
            <style>{`
              @keyframes vg-bounce {
                0%, 100% { transform: translateY(0); opacity: 0.5; }
                50% { transform: translateY(-6px); opacity: 1; }
              }
              @keyframes vg-flower-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
              }
              @keyframes vg-flower-sway {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(1deg); }
                75% { transform: rotate(-1deg); }
              }
            `}</style>
          </div>
        )}
        {/* Garden canvas */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            background: "#f2ede4",
            borderRadius: "14px",
            border: "1px solid rgba(154,175,122,0.3)",
          }}
        >
          {/* Grain texture overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.06 }}
          >
            <filter id="vg-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#vg-grain)" />
          </svg>

          {/* Grass strip */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none rounded-b-xl"
            style={{
              background:
                "linear-gradient(to top, rgba(156,184,145,0.45), transparent)",
            }}
          />

          {/* Sparkle dots */}
          {[
            [12, 18],
            [44, 8],
            [72, 13],
            [87, 38],
            [55, 56],
            [19, 74],
            [67, 79],
            [33, 43],
            [92, 52],
            [6, 62],
          ].map(([x, y], i) => (
            <div
              key={i}
              className="absolute text-[7px] text-[#C4B49A] opacity-50 select-none pointer-events-none"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              ✦
            </div>
          ))}

          {/* Flower plants */}
          {blooms.map((bloom) => {
            const isHov = hovered === bloom.id;
            const tipAbove = bloom.y > 52;
            const swayDelay = (bloom.id % 11) * 0.25;
            return (
              <div
                key={bloom.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${bloom.x}%`,
                  top: `${bloom.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHovered(bloom.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  style={{
                    animation: `vg-flower-float 4s ease-in-out ${swayDelay}s infinite, vg-flower-sway 6.5s ease-in-out ${
                      swayDelay * 0.8
                    }s infinite`,
                  }}
                >
                  <div
                    className="transition-transform duration-200 drop-shadow-sm"
                    style={{
                      transform: isHov
                        ? "scale(1.12) translateY(-3px)"
                        : "scale(1)",
                    }}
                  >
                    <FlowerSvg type={bloom.flower} size={64} />
                  </div>
                </div>
                {isHov && (
                  <div
                    className="absolute z-20 shadow-lg px-3 py-2.5 w-44 pointer-events-none"
                    style={{
                      background: "#ffffff",
                      border: "0.5px solid rgba(154,175,122,0.3)",
                      borderRadius: "12px",
                      [tipAbove ? "bottom" : "top"]: "calc(100% + 10px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <p
                      className="text-[14px] font-medium select-none leading-tight"
                      style={{
                        color: "#2d4a1e",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {bloom.flowerName}
                    </p>
                    <p
                      className="text-[12px] select-none mt-0.5"
                      style={{
                        color: "#9aaf7a",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      by {bloom.name}
                    </p>
                    <p
                      className="text-[12px] select-none mt-0.5"
                      style={{
                        color: "#9aaf7a",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {bloom.date}
                    </p>
                    <p
                      className="text-[14px] italic select-none mt-1.5 pt-1.5 leading-relaxed"
                      style={{
                        color: "#5a7040",
                        fontFamily: "Inter, sans-serif",
                        borderTop: "0.5px solid rgba(154,175,122,0.2)",
                      }}
                    >
                      {bloom.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: visitor card list */}
        <div className="w-[220px] overflow-y-auto shrink-0 flex flex-col gap-2.5 pb-4 scrollbar-hide">
          {blooms.map((bloom) => {
            return (
              <div
                key={bloom.id}
                className="flex flex-col gap-1.5 transition-all duration-200 cursor-pointer select-none"
                style={{
                  background: "#ffffff",
                  border: "0.5px solid rgba(154,175,122,0.3)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(107,143,78,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(154,175,122,0.3)";
                }}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="shrink-0 w-10 flex items-end justify-center">
                    <FlowerSvg type={bloom.flower} size={48} />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p
                      className="text-[14px] font-normal leading-tight"
                      style={{
                        color: "#2d4a1e",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {bloom.flowerName}
                    </p>
                    <p
                      className="text-[12px]"
                      style={{
                        color: "#9aaf7a",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      by {bloom.name}
                    </p>
                    <p
                      className="text-[14px] leading-relaxed mt-0.5"
                      style={{
                        color: "#5a7040",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {bloom.message}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-end justify-between pt-1.5 mt-0.5"
                  style={{ borderTop: "0.5px solid rgba(154,175,122,0.15)" }}
                >
                  <p
                    className="text-[12px]"
                    style={{
                      color: "#9aaf7a",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {bloom.date}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      color: "#9aaf7a",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    No. {bloom.num}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer stats ───────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-stretch mt-3"
        style={{
          borderTop: "0.5px solid rgba(154,175,122,0.2)",
          background: "#FAF7F2",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-3 flex-1">
          <span className="text-xl opacity-70">🌿</span>
          <div>
            <p
              className="leading-none select-none"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2d4a1e",
              }}
            >
              {totalCount ?? blooms.length}
            </p>
            <p
              className="mt-0.5 select-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 300,
                color: "#9aaf7a",
              }}
            >
              Blooms planted so far
            </p>
          </div>
        </div>
        <div className="w-px" style={{ background: "rgba(154,175,122,0.2)" }} />
        <div className="flex items-center px-5 py-3 flex-1">
          <p
            className="leading-relaxed select-none"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 300,
              color: "#9aaf7a",
            }}
          >
            Every flower here was planted
            <br />
            by a visitor with a kind heart.
          </p>
        </div>
        <div className="w-px" style={{ background: "rgba(154,175,122,0.2)" }} />
        <div className="flex items-center gap-2 px-5 py-3 flex-1">
          <span className="text-base">🦋</span>
          <p
            className="select-none"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 300,
              color: "#9aaf7a",
            }}
          >
            Hover a bloom
            <br />
            to read its story
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Node Card Overlay ───────────────────────────────────────────────────────
function NodeCard({
  node: _node,
  onClose,
  origin,
  forceClose,
}: {
  node: NodeDef;
  onClose: () => void;
  origin: { x: number; y: number } | null;
  forceClose?: boolean;
}) {
  const [closing, setClosing] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const justDraggedRef = useRef(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }

  const isClosing = closing || forceClose;
  const transformOrigin = origin
    ? `${origin.x}px ${origin.y}px`
    : "center center";

  // ── Drag from chrome bar ────────────────────────────────────────────────
  function onChromeMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    const card = cardRef.current;
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const container = card.closest(
      "[data-card-container]",
    ) as HTMLElement | null;
    const cRect = container?.getBoundingClientRect() ?? { left: 0, top: 0 };

    // Snap to absolute coordinates within canvas-overlay on first drag
    setPos({ x: cardRect.left - cRect.left, y: cardRect.top - cRect.top });
    offsetRef.current = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    };
    setIsDragging(true);

    function onMove(ev: MouseEvent) {
      const c = (
        card!.closest("[data-card-container]") as HTMLElement | null
      )?.getBoundingClientRect() ?? { left: 0, top: 0 };
      setPos({
        x: ev.clientX - c.left - offsetRef.current.x,
        y: ev.clientY - c.top - offsetRef.current.y,
      });
    }
    function onUp() {
      setIsDragging(false);
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 100);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      data-card-container=""
      className={`absolute inset-0 z-20 ${isClosing ? "backdrop-out" : "backdrop-in"}`}
    >
      {/* Backdrop – click to close */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"
        onClick={() => {
          if (!justDraggedRef.current) handleClose();
        }}
      />

      {/* Card wrapper – centered initially, freely positioned after first drag */}
      <div
        className={
          pos
            ? "absolute"
            : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }
        style={pos ? { left: pos.x, top: pos.y } : {}}
      >
        <div
          ref={cardRef}
          className={`relative rounded-2xl shadow-xl w-[420px] max-w-[90vw] overflow-hidden ${isClosing ? "mac-close" : "mac-open"}`}
          style={{
            transformOrigin: pos ? "center center" : transformOrigin,
            background: "#FAF6EE",
            border: "1px solid #DDD3C0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Window chrome — drag handle */}
          <div
            className="group/chrome flex items-center gap-1.5 px-4 pt-3.5 pb-3 border-b border-[#EDE5D6] select-none"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={onChromeMouseDown}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Close"
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90
                transition-all duration-100 flex items-center justify-center
                focus:outline-none group/dot"
              aria-label="Close"
            >
              <svg
                className="w-1.5 h-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
                viewBox="0 0 8 8"
                fill="none"
                stroke="#7A0000"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="7" y2="7" />
                <line x1="7" y1="1" x2="1" y2="7" />
              </svg>
            </button>
            <span
              className="w-3 h-3 rounded-full bg-[#D9D9D9]"
              title="Minimize"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#D9D9D9]"
              title="Maximize"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 select-none">
              {_node.label}
            </span>
            {_node.desc && (
              <span className="ml-2 text-sm text-[#9B8F83] select-none truncate">
                {_node.desc}
              </span>
            )}
            {_node.num && (
              <span className="ml-auto text-[11px] font-mono tracking-widest text-[#B8A898] select-none shrink-0">
                {_node.num}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="px-6 py-10 flex flex-col items-center gap-4 min-h-[200px] justify-center">
            <div className="w-14 h-14 rounded-full bg-[#EDF5E8] border border-[#C5DEBA] flex items-center justify-center">
              <span className="text-2xl select-none">🌱</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-[15px] font-medium text-gray-700 select-none">
                {_node.label}
              </p>
              {_node.desc && (
                <p className="text-[13px] text-[#9B8F83] select-none text-center leading-relaxed max-w-[260px]">
                  {_node.desc}
                </p>
              )}
            </div>
            <p className="text-[12px] text-[#B8A898] tracking-wide select-none mt-2">
              Content coming soon 🌿
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 pb-4">
            <button
              onClick={handleClose}
              className="select-none px-5 py-2 rounded-lg text-sm font-medium
                text-[#5A7E52] bg-[#EDF5E8] border border-[#C5DEBA]
                hover:bg-[#DDEEDA] hover:border-[#8FAF7E]
                active:scale-95 transition-all duration-150 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Node Icon Builder ────────────────────────────────────────────────────────
function makeNodeIcon(id: string): SVGElement[] {
  const NS = "http://www.w3.org/2000/svg";
  const S = "#8FAF7E"; // sage stroke
  const F = "#EAF2E8"; // sage light fill
  const A = "#6B9962"; // sage dark accent
  const W = "#FDF8F2"; // warm white fill
  function ic(
    tag: string,
    attrs: Record<string, string | number> = {},
  ): SVGElement {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, String(v)));
    e.setAttribute("pointer-events", "none");
    return e;
  }
  switch (id) {
    case "listen":
      return [
        ic("circle", { r: 14, fill: W, stroke: S, "stroke-width": 1.4 }),
        ic("circle", { r: 7, fill: "none", stroke: S, "stroke-width": 1 }),
        ic("circle", { r: 2.5, fill: S }),
        ic("line", {
          x1: 7,
          y1: -11,
          x2: 14,
          y2: -7,
          stroke: S,
          "stroke-width": 1.2,
          "stroke-linecap": "round",
        }),
      ];
    case "drawing":
      return [
        ic("path", {
          d: "M-11,-8 L-11,8 C-11,8 0,6 0,8 L0,-8 C0,-6 -11,-8 -11,-8 Z",
          fill: F,
          stroke: S,
          "stroke-width": 1.2,
          "stroke-linejoin": "round",
        }),
        ic("path", {
          d: "M11,-8 L11,8 C11,8 0,6 0,8 L0,-8 C0,-6 11,-8 11,-8 Z",
          fill: W,
          stroke: S,
          "stroke-width": 1.2,
          "stroke-linejoin": "round",
        }),
        ic("rect", { x: 7, y: -14, width: 4, height: 9, rx: 1.5, fill: A }),
        ic("path", { d: "M7,-5 L11,-5 L9,-2 Z", fill: A }),
      ];
    case "read":
      return [
        ic("rect", {
          x: -13,
          y: 5,
          width: 26,
          height: 7,
          rx: 1,
          fill: A,
          stroke: S,
          "stroke-width": 0.8,
        }),
        ic("rect", {
          x: -11,
          y: -2,
          width: 22,
          height: 7,
          rx: 1,
          fill: F,
          stroke: S,
          "stroke-width": 0.8,
        }),
        ic("rect", {
          x: -13,
          y: -9,
          width: 26,
          height: 7,
          rx: 1,
          fill: W,
          stroke: S,
          "stroke-width": 0.8,
        }),
        ic("line", {
          x1: -9,
          y1: -9,
          x2: -9,
          y2: -2,
          stroke: S,
          "stroke-width": 0.6,
          opacity: 0.5,
        }),
        ic("line", {
          x1: -7,
          y1: -2,
          x2: -7,
          y2: 5,
          stroke: S,
          "stroke-width": 0.6,
          opacity: 0.5,
        }),
      ];
    case "pixelart":
      return [
        ic("rect", {
          x: -13,
          y: -13,
          width: 26,
          height: 26,
          rx: 2.5,
          fill: W,
          stroke: S,
          "stroke-width": 1.5,
        }),
        ic("rect", { x: -8, y: -8, width: 16, height: 16, rx: 1, fill: F }),
        ic("rect", { x: -6, y: -6, width: 4, height: 4, fill: A }),
        ic("rect", { x: -1, y: -6, width: 4, height: 4, fill: S }),
        ic("rect", { x: -6, y: -1, width: 4, height: 4, fill: S }),
        ic("rect", { x: -1, y: -1, width: 4, height: 4, fill: F }),
        ic("rect", { x: -6, y: 4, width: 4, height: 4, fill: F }),
        ic("rect", { x: -1, y: 4, width: 4, height: 4, fill: A }),
      ];
    case "testimony":
      return [
        ic("path", {
          d: "M-6,-13 L-6,-8 C-12,-6 -12,9 0,11 C12,9 12,-6 6,-8 L6,-13 Z",
          fill: F,
          stroke: S,
          "stroke-width": 1.3,
        }),
        ic("rect", {
          x: -7,
          y: -15,
          width: 14,
          height: 4,
          rx: 1.5,
          fill: W,
          stroke: S,
          "stroke-width": 1,
        }),
        ic("path", {
          d: "M0,5 C0,5 -5,1 -5,-1 C-5,-4 -3,-5 -1,-4 C-0.5,-3.5 0,-3 0,-3 C0,-3 0.5,-3.5 1,-4 C3,-5 5,-4 5,-1 C5,1 0,5 0,5 Z",
          fill: A,
        }),
      ];
    case "project":
      return [
        ic("path", {
          d: "M-9,11 L-13,2 L13,2 L9,11 Z",
          fill: A,
          stroke: S,
          "stroke-width": 1.2,
        }),
        ic("rect", {
          x: -13,
          y: -1,
          width: 26,
          height: 5,
          rx: 1.5,
          fill: F,
          stroke: S,
          "stroke-width": 1,
        }),
        ic("line", {
          x1: 0,
          y1: -1,
          x2: 0,
          y2: -13,
          stroke: A,
          "stroke-width": 1.5,
          "stroke-linecap": "round",
        }),
        ic("ellipse", {
          cx: -5,
          cy: -7,
          rx: 5,
          ry: 3,
          fill: S,
          transform: "rotate(-35,-5,-7)",
        }),
        ic("ellipse", {
          cx: 5,
          cy: -10,
          rx: 5,
          ry: 3,
          fill: A,
          transform: "rotate(30,5,-10)",
        }),
      ];
    case "watch":
      return [
        ic("rect", {
          x: -13,
          y: -7,
          width: 26,
          height: 18,
          rx: 3.5,
          fill: W,
          stroke: S,
          "stroke-width": 1.3,
        }),
        ic("rect", {
          x: -5,
          y: -11,
          width: 10,
          height: 6,
          rx: 2,
          fill: F,
          stroke: S,
          "stroke-width": 1,
        }),
        ic("circle", { r: 7, cy: 2, fill: F, stroke: S, "stroke-width": 1.3 }),
        ic("circle", {
          r: 3.5,
          cy: 2,
          fill: W,
          stroke: S,
          "stroke-width": 0.8,
        }),
        ic("circle", { cx: 8, cy: -2, r: 2, fill: A }),
      ];
    case "about":
      return [
        ic("path", {
          d: "M-11,-2 C-11,-9 -4,-13 4,-13 C12,-13 13,-7 11,0 C9,7 3,11 -3,11 C-11,11 -13,5 -11,-2 Z",
          fill: F,
          stroke: S,
          "stroke-width": 1.3,
        }),
        ic("path", {
          d: "M-11,-6 C-17,-7 -18,5 -11,4",
          fill: "none",
          stroke: S,
          "stroke-width": 1.5,
          "stroke-linecap": "round",
        }),
        ic("path", {
          d: "M11,-1 L18,-9",
          fill: "none",
          stroke: S,
          "stroke-width": 2,
          "stroke-linecap": "round",
        }),
        ic("circle", { cx: 20, cy: -11, r: 1.5, fill: "#87CEEB" }),
        ic("circle", { cx: 22, cy: -7, r: 1, fill: "#87CEEB" }),
        ic("circle", { cx: 17, cy: -13, r: 1, fill: "#87CEEB" }),
      ];
    case "resume":
      return [
        ic("rect", {
          x: -11,
          y: -11,
          width: 22,
          height: 22,
          rx: 2,
          fill: W,
          stroke: S,
          "stroke-width": 1.3,
        }),
        ic("ellipse", {
          cx: 0,
          cy: -11,
          rx: 11,
          ry: 3.5,
          fill: F,
          stroke: S,
          "stroke-width": 1,
        }),
        ic("ellipse", {
          cx: 0,
          cy: 11,
          rx: 11,
          ry: 3.5,
          fill: F,
          stroke: S,
          "stroke-width": 1,
        }),
        ic("line", {
          x1: -6,
          y1: -4,
          x2: 6,
          y2: -4,
          stroke: S,
          "stroke-width": 1,
          "stroke-linecap": "round",
        }),
        ic("line", {
          x1: -7,
          y1: 0,
          x2: 7,
          y2: 0,
          stroke: S,
          "stroke-width": 1,
          "stroke-linecap": "round",
        }),
        ic("line", {
          x1: -6,
          y1: 4,
          x2: 6,
          y2: 4,
          stroke: S,
          "stroke-width": 1,
          "stroke-linecap": "round",
        }),
      ];
    default:
      return [ic("circle", { r: 12, fill: F, stroke: S, "stroke-width": 1.3 })];
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ForceGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ── Page Panel state ──────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState<string | null>(null);
  const [closingPage, setClosingPage] = useState<string | null>(null);
  const [pageOrigin, setPageOrigin] = useState<{ x: number; y: number } | null>(
    null,
  );
  // Ref to track current active page without stale-closure issues in effects
  const pageRef = useRef<{
    active: string | null;
    timer: ReturnType<typeof setTimeout> | null;
  }>({ active: null, timer: null });

  // ── Node Card state ───────────────────────────────────────────────────────
  const [activeNode, setActiveNode] = useState<NodeDef | null>(null);
  const [nodeOrigin, setNodeOrigin] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isNodeClosing, setIsNodeClosing] = useState(false);

  // ── Page helpers (stable: only call stable setters + pageRef) ─────────────
  function openPage(
    id: string,
    origin: { x: number; y: number } | null = null,
  ) {
    if (pageRef.current.timer) clearTimeout(pageRef.current.timer);
    const prev = pageRef.current.active;
    pageRef.current.active = id;
    if (prev && prev !== id) {
      setClosingPage(prev);
      pageRef.current.timer = setTimeout(() => setClosingPage(null), 200);
    }
    setActivePage(id);
    setPageOrigin(origin);
  }

  function closeCurrentPage() {
    const curr = pageRef.current.active;
    if (!curr) return;
    if (pageRef.current.timer) clearTimeout(pageRef.current.timer);
    pageRef.current.active = null;
    setClosingPage(curr);
    pageRef.current.timer = setTimeout(() => {
      setClosingPage(null);
      setActivePage(null);
      setPageOrigin(null);
      window.dispatchEvent(new CustomEvent("page-closed"));
    }, 200);
  }

  // ── Page & navigation event listeners ────────────────────────────────────
  useEffect(() => {
    function handleOpenPage(e: Event) {
      const { page, origin } = (
        e as CustomEvent<{
          page: string;
          origin?: { x: number; y: number } | null;
        }>
      ).detail;
      openPage(page, origin ?? null);
      window.dispatchEvent(
        new CustomEvent("page-nav-update", { detail: { page } }),
      );
    }
    // Backward compat: old 'open-project-page' event
    function handleOpenProjectLegacy(e: Event) {
      const origin = (e as CustomEvent).detail?.origin ?? null;
      openPage("project", origin);
      window.dispatchEvent(
        new CustomEvent("page-nav-update", { detail: { page: "project" } }),
      );
    }
    function handleNavigateHome() {
      closeCurrentPage();
      setIsNodeClosing(true);
      setTimeout(() => {
        setActiveNode(null);
        setIsNodeClosing(false);
      }, 200);
    }
    window.addEventListener("open-page", handleOpenPage);
    window.addEventListener("open-project-page", handleOpenProjectLegacy);
    window.addEventListener("navigate-home", handleNavigateHome);
    return () => {
      window.removeEventListener("open-page", handleOpenPage);
      window.removeEventListener("open-project-page", handleOpenProjectLegacy);
      window.removeEventListener("navigate-home", handleNavigateHome);
    };
  }, []);

  // ── Main simulation ───────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    let W = wrap.clientWidth || 900;
    let H = wrap.clientHeight || 600;

    const setViewBox = () => svg!.setAttribute("viewBox", `0 0 ${W} ${H}`);
    setViewBox();

    // ── Simulation ────────────────────────────────────────────────────────────
    const simNodes: SimNode[] = NODES.map((n, i) => ({
      ...n,
      x: W / 2 + (i === 0 ? 0 : (Math.random() - 0.5) * 300),
      y: H / 2 + (i === 0 ? 0 : (Math.random() - 0.5) * 220),
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }));

    const simLinks: SimLink[] = LINKS.map((l) => ({ ...l }));

    const simulation = forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(180)
          .strength(0.06),
      )
      .force("charge", forceManyBody().strength(-260))
      .force("collide", forceCollide<SimNode>().radius(72).strength(0.7))
      .alphaDecay(0) // don't auto-decay — orbital force keeps it alive
      .velocityDecay(0.38)
      .alphaTarget(0.08) // run forever at low energy
      .alphaMin(0);

    // Per-node orbital speed multiplier (slight variation = natural feel)
    const orbitSpeed: Record<string, number> = {};
    simNodes.forEach((d) => {
      if (d.type === "branch") orbitSpeed[d.id] = 0.75 + Math.random() * 0.5;
    });

    const ORBIT_FORCE = 0.14; // tangential acceleration per tick (halved for slower orbit)

    // ── Orbital force (applied every tick by d3) ──────────────────────────────
    simulation.force("orbital", () => {
      if (dragging) return;
      const center = simNodes.find((n) => n.id === "center")!;
      const cx = center.x ?? W / 2;
      const cy = center.y ?? H / 2;
      simNodes.forEach((d) => {
        if (d.type !== "branch") return;
        const dx = (d.x ?? 0) - cx;
        const dy = (d.y ?? 0) - cy;
        const r = Math.sqrt(dx * dx + dy * dy) || 1;
        const spd = ORBIT_FORCE * (orbitSpeed[d.id] ?? 1);
        // Counter-clockwise tangential unit vector: (-dy/r, dx/r)
        d.vx = (d.vx ?? 0) + (-dy / r) * spd;
        d.vy = (d.vy ?? 0) + (dx / r) * spd;
      });
    });

    // ── SVG Defs ──────────────────────────────────────────────────────────────
    const defs = el("defs") as SVGDefsElement;

    // Node drop-shadow filter
    const shadowFilt = el("filter");
    shadowFilt.id = "node-shadow";
    shadowFilt.setAttribute("x", "-30%");
    shadowFilt.setAttribute("y", "-30%");
    shadowFilt.setAttribute("width", "160%");
    shadowFilt.setAttribute("height", "160%");
    const sfBlur = el("feGaussianBlur");
    sfBlur.setAttribute("in", "SourceAlpha");
    sfBlur.setAttribute("stdDeviation", "3");
    sfBlur.setAttribute("result", "blur");
    const sfOffset = el("feOffset");
    sfOffset.setAttribute("dx", "0");
    sfOffset.setAttribute("dy", "2");
    sfOffset.setAttribute("result", "ob");
    const sfFlood = el("feFlood");
    sfFlood.setAttribute("flood-color", "#8B6B4A");
    sfFlood.setAttribute("flood-opacity", "0.10");
    sfFlood.setAttribute("result", "col");
    const sfComp = el("feComposite");
    sfComp.setAttribute("in", "col");
    sfComp.setAttribute("in2", "ob");
    sfComp.setAttribute("operator", "in");
    sfComp.setAttribute("result", "shad");
    const sfMerge = el("feMerge");
    const sfm1 = el("feMergeNode");
    sfm1.setAttribute("in", "shad");
    const sfm2 = el("feMergeNode");
    sfm2.setAttribute("in", "SourceGraphic");
    sfMerge.append(sfm1, sfm2);
    shadowFilt.append(sfBlur, sfOffset, sfFlood, sfComp, sfMerge);

    // Center glow filter
    const glowFilt = el("filter");
    glowFilt.id = "center-glow";
    glowFilt.setAttribute("x", "-40%");
    glowFilt.setAttribute("y", "-40%");
    glowFilt.setAttribute("width", "180%");
    glowFilt.setAttribute("height", "180%");
    const gfBlur = el("feGaussianBlur");
    gfBlur.setAttribute("stdDeviation", "5");
    gfBlur.setAttribute("result", "gb");
    const gfMerge = el("feMerge");
    const gfm1 = el("feMergeNode");
    gfm1.setAttribute("in", "gb");
    const gfm2 = el("feMergeNode");
    gfm2.setAttribute("in", "SourceGraphic");
    gfMerge.append(gfm1, gfm2);
    glowFilt.append(gfBlur, gfMerge);

    // Warm radial gradient for center node
    const cGrad = el("radialGradient") as SVGRadialGradientElement;
    cGrad.id = "center-grad";
    ["cx", "cy", "r"].forEach((a) => cGrad.setAttribute(a, "50%"));
    const cg1 = el("stop");
    cg1.setAttribute("offset", "0%");
    cg1.setAttribute("stop-color", "#FFFDF9");
    const cg2 = el("stop");
    cg2.setAttribute("offset", "100%");
    cg2.setAttribute("stop-color", "#EDE7DB");
    cGrad.append(cg1, cg2);

    defs.append(shadowFilt, glowFilt, cGrad);
    svg.appendChild(defs);

    // ── Groups ────────────────────────────────────────────────────────────────
    const linkG = el("g");
    svg.appendChild(linkG);
    const nodeG = el("g");
    svg.appendChild(nodeG);

    // ── Links (botanical vine paths) ──────────────────────────────────────────
    type VineEl = {
      group: SVGGElement;
      stem: SVGPathElement;
      leafA: SVGPathElement;
      leafB: SVGPathElement;
    };
    const LEAF_FILLS = [
      "#AECA9E",
      "#9CB891",
      "#B5D1A5",
      "#A8C898",
      "#B2CF9E",
      "#C4DDB8",
      "#98C08E",
      "#B0CA9A",
    ];
    const LEAF_D = "M0,-4.5 C3.2,-2 3.2,2 0,4.5 C-3.2,2 -3.2,-2 0,-4.5 Z";

    const vineEls: VineEl[] = simLinks.map((_, i) => {
      const group = el("g") as SVGGElement;
      group.style.opacity = "0.82";
      group.style.transition = "opacity 0.25s ease";

      const stem = el("path") as SVGPathElement;
      stem.setAttribute("fill", "none");
      stem.setAttribute("stroke", "#8FAF7E");
      stem.setAttribute("stroke-width", "1.4");
      stem.setAttribute("stroke-linecap", "round");
      stem.setAttribute("pointer-events", "none");

      const leafA = el("path") as SVGPathElement;
      leafA.setAttribute("d", LEAF_D);
      leafA.setAttribute("fill", LEAF_FILLS[i % LEAF_FILLS.length]);
      leafA.setAttribute("opacity", "0.72");
      leafA.setAttribute("pointer-events", "none");

      const leafB = el("path") as SVGPathElement;
      leafB.setAttribute("d", LEAF_D);
      leafB.setAttribute("fill", LEAF_FILLS[(i + 3) % LEAF_FILLS.length]);
      leafB.setAttribute("opacity", "0.60");
      leafB.setAttribute("pointer-events", "none");

      group.append(stem, leafA, leafB);
      linkG.appendChild(group);
      return { group, stem, leafA, leafB };
    });

    // Expose groups under old name for hover-opacity control
    const linkEls = vineEls.map((v) => v.group);

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const nodeElMap: Record<string, SVGGElement> = {};

    simNodes.forEach((d) => {
      const g = el("g") as SVGGElement;
      nodeElMap[d.id] = g;

      if (d.type === "center") {
        g.style.cursor = "grab";

        // Animated pulse ring
        const ring = el("circle") as SVGCircleElement;
        ring.setAttribute("r", "52");
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "#9CB891");
        ring.setAttribute("stroke-width", "1");
        ring.setAttribute("opacity", "0.25");
        ring.classList.add("pulse-ring");

        // Main warm circle
        const circ = el("circle") as SVGCircleElement;
        circ.setAttribute("r", "44");
        circ.setAttribute("fill", "url(#center-grad)");
        circ.setAttribute("stroke", "#8FAF7E");
        circ.setAttribute("stroke-width", "1.5");
        circ.setAttribute("filter", "url(#center-glow)");

        // ── Flower pot icon (inside circle) ──────────────────────────────
        const iconG = el("g") as SVGGElement;
        iconG.setAttribute("pointer-events", "none");
        iconG.setAttribute("transform", "translate(0,-4)");

        const NS2 = "http://www.w3.org/2000/svg";
        function fi(
          tag: string,
          attrs: Record<string, string | number> = {},
        ): SVGElement {
          const e = document.createElementNS(NS2, tag);
          Object.entries(attrs).forEach(([k, v]) =>
            e.setAttribute(k, String(v)),
          );
          e.setAttribute("pointer-events", "none");
          return e;
        }
        // Pot
        iconG.append(
          fi("path", {
            d: "M-10,12 L-14,3 L14,3 L10,12 Z",
            fill: "#C8DFC4",
            stroke: "#8FAF7E",
            "stroke-width": 1,
          }),
          fi("rect", {
            x: -14,
            y: 0,
            width: 28,
            height: 5,
            rx: 2,
            fill: "#EAF2E8",
            stroke: "#8FAF7E",
            "stroke-width": 1,
          }),
          // Stem
          fi("line", {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: -20,
            stroke: "#7A9E72",
            "stroke-width": 1.5,
            "stroke-linecap": "round",
          }),
          // Petals (daisy)
          fi("ellipse", { cx: 0, cy: -28, rx: 5, ry: 3.5, fill: "#FCDDE9" }),
          fi("ellipse", {
            cx: 0,
            cy: -28,
            rx: 5,
            ry: 3.5,
            fill: "#FCDDE9",
            transform: "rotate(45,0,-28)",
          }),
          fi("ellipse", {
            cx: 0,
            cy: -28,
            rx: 5,
            ry: 3.5,
            fill: "#FCDDE9",
            transform: "rotate(90,0,-28)",
          }),
          fi("ellipse", {
            cx: 0,
            cy: -28,
            rx: 5,
            ry: 3.5,
            fill: "#FCDDE9",
            transform: "rotate(135,0,-28)",
          }),
          // Flower center
          fi("circle", { cx: 0, cy: -28, r: 5, fill: "#F9E07E" }),
          // Side leaf
          fi("ellipse", {
            cx: -8,
            cy: -14,
            rx: 6,
            ry: 3,
            fill: "#9CB891",
            transform: "rotate(-30,-8,-14)",
          }),
          fi("ellipse", {
            cx: 8,
            cy: -10,
            rx: 6,
            ry: 3,
            fill: "#8FAF7E",
            transform: "rotate(30,8,-10)",
          }),
        );

        // "Fitri Zahwa" text below circle
        const name = txt(d.label, {
          size: 14,
          weight: 700,
          fill: "#3D3128",
          dy: 66,
        });

        // Location text
        const locText = el("text") as SVGTextElement;
        locText.setAttribute("font-family", "Inter, system-ui, sans-serif");
        locText.setAttribute("font-size", "12");
        locText.setAttribute("font-weight", "400");
        locText.setAttribute("fill", "#8B7E74");
        locText.setAttribute("text-anchor", "middle");
        locText.setAttribute("dominant-baseline", "middle");
        locText.setAttribute("dy", "82");
        locText.setAttribute("pointer-events", "none");
        locText.textContent = d.sublabel ?? "";

        g.append(ring, circ, iconG, name, locText);

        g.addEventListener("mouseenter", () => {
          circ.setAttribute("stroke", "#7A9E72");
          circ.setAttribute("stroke-width", "2");
        });
        g.addEventListener("mouseleave", () => {
          circ.setAttribute("stroke", "#8FAF7E");
          circ.setAttribute("stroke-width", "1.5");
        });
      } else {
        g.style.cursor = "pointer";

        // ── Circular container ────────────────────────────────────────────
        const circ = el("circle") as SVGCircleElement;
        circ.setAttribute("r", "36");
        circ.setAttribute("fill", "#FFFDF9");
        circ.setAttribute("stroke", "#C5B49A");
        circ.setAttribute("stroke-width", "1.2");
        circ.setAttribute("filter", "url(#node-shadow)");

        // Icon group inside circle
        const iconG = el("g") as SVGGElement;
        iconG.setAttribute("pointer-events", "none");
        makeNodeIcon(d.id).forEach((e) => iconG.appendChild(e));

        // ── Number label (above circle) ───────────────────────────────────
        const numEl = el("text") as SVGTextElement;
        numEl.setAttribute("font-family", "Inter, system-ui, sans-serif");
        numEl.setAttribute("font-size", "12");
        numEl.setAttribute("font-weight", "500");
        numEl.setAttribute("fill", "#B0A898");
        numEl.setAttribute("text-anchor", "middle");
        numEl.setAttribute("dominant-baseline", "middle");
        numEl.setAttribute("letter-spacing", "2");
        numEl.setAttribute("dy", "-58");
        numEl.setAttribute("pointer-events", "none");
        numEl.textContent = d.num ?? "";

        // ── Title (below circle) ──────────────────────────────────────────
        const title = el("text") as SVGTextElement;
        title.setAttribute("font-family", "Inter, system-ui, sans-serif");
        title.setAttribute("font-size", "14");
        title.setAttribute("font-weight", "600");
        title.setAttribute("fill", "#3D3128");
        title.setAttribute("text-anchor", "middle");
        title.setAttribute("dominant-baseline", "middle");
        title.setAttribute("dy", "52");
        title.setAttribute("pointer-events", "none");
        title.textContent = d.label;

        // ── Description (below title, hidden by default) ──────────────────
        const desc = el("text") as SVGTextElement;
        desc.setAttribute("font-family", "Inter, system-ui, sans-serif");
        desc.setAttribute("font-size", "12");
        desc.setAttribute("font-weight", "400");
        desc.setAttribute("fill", "#8B7E74");
        desc.setAttribute("text-anchor", "middle");
        desc.setAttribute("dominant-baseline", "middle");
        desc.setAttribute("dy", "68");
        desc.setAttribute("pointer-events", "none");
        desc.textContent = d.desc ?? "";
        desc.style.opacity = "0";
        desc.style.transition = "opacity 0.2s ease";

        g.append(circ, iconG, numEl, title, desc);
        g.style.transition = "opacity 0.25s ease";

        g.addEventListener("mouseenter", () => {
          circ.setAttribute("stroke", "#7A9E72");
          circ.setAttribute("stroke-width", "2");
          desc.style.opacity = "1";
          title.setAttribute("fill", "#1E1A16");

          // Dim all other branch nodes
          simNodes.forEach((other) => {
            if (other.type !== "branch" || other.id === d.id) return;
            const og = nodeElMap[other.id];
            if (og) og.style.opacity = "0.12";
          });
          // Dim links that don't belong to this node
          LINKS.forEach((link, i) => {
            if (link.target !== d.id) linkEls[i].style.opacity = "0.08";
          });
        });

        g.addEventListener("mouseleave", () => {
          circ.setAttribute("stroke", "#C5B49A");
          circ.setAttribute("stroke-width", "1.2");
          desc.style.opacity = "0";
          title.setAttribute("fill", "#3D3128");

          // Restore all branch nodes
          simNodes.forEach((other) => {
            if (other.type !== "branch") return;
            const og = nodeElMap[other.id];
            if (og) og.style.opacity = "1";
          });
          // Restore all links
          linkEls.forEach((p) => {
            p.style.opacity = "0.82";
          });
        });

        // ── Click → open card ──────────────────────────────────────────────
        g.addEventListener("click", () => {
          const svgEl = svgRef.current!;
          const wrapEl = wrapRef.current!;

          // Convert SVG node coords → screen coords
          const pt = (svgEl as any).createSVGPoint() as SVGPoint;
          pt.x = d.x ?? 0;
          pt.y = d.y ?? 0;
          const screen = pt.matrixTransform((svgEl as any).getScreenCTM()!);

          // Estimate card position (centered in wrap)
          const wb = wrapEl.getBoundingClientRect();
          const CARD_W = Math.min(420, wb.width * 0.9);
          const CARD_H = 320; // approximate rendered height
          const cardLeft = wb.left + (wb.width - CARD_W) / 2;
          const cardTop = wb.top + (wb.height - CARD_H) / 2;

          const origin = { x: screen.x - cardLeft, y: screen.y - cardTop };

          if (d.id === "project" || d.id === "about") {
            // Dispatch unified open-page event so NavMenu & page system both update
            window.dispatchEvent(
              new CustomEvent("open-page", { detail: { page: d.id, origin } }),
            );
          } else {
            setNodeOrigin(origin);
            setActiveNode(d);
          }
        });
      }

      nodeG.appendChild(g);
    });

    // ── Drag (center) ─────────────────────────────────────────────────────────
    const centerG = nodeElMap["center"];
    const centerNode = simNodes.find((n) => n.id === "center")!;

    function svgPoint(e: MouseEvent | TouchEvent) {
      const pt = (svg as any).createSVGPoint() as SVGPoint;
      const src =
        "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
      pt.x = src.clientX;
      pt.y = src.clientY;
      return pt.matrixTransform((svg as any).getScreenCTM()!.inverse());
    }

    let dragging = false;

    centerG.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      centerG.style.cursor = "grabbing";
      simulation.alphaTarget(0.4).restart();
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });

    centerG.addEventListener(
      "touchstart",
      () => {
        dragging = true;
        simulation.alphaTarget(0.4).restart();
        window.addEventListener("touchmove", onMove as any, { passive: false });
        window.addEventListener("touchend", onUp);
      },
      { passive: true },
    );

    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      (e as Event).preventDefault();
      const p = svgPoint(e as MouseEvent);
      const margin = 60;
      centerNode.fx = Math.max(margin, Math.min(W - margin, p.x));
      centerNode.fy = Math.max(margin, Math.min(H - margin, p.y));
    }

    function onUp() {
      dragging = false;
      centerG.style.cursor = "grab";
      centerNode.fx = null;
      centerNode.fy = null;

      // Burst of energy on release → then smoothly return to orbital cruise
      (simulation.force("link") as any).strength(0.18);
      simulation.velocityDecay(0.22).alphaTarget(0.4).restart();
      setTimeout(() => {
        simulation.velocityDecay(0.3).alphaTarget(0.2);
      }, 400);
      setTimeout(() => {
        (simulation.force("link") as any).strength(0.06);
        simulation.velocityDecay(0.38).alphaTarget(0.08);
      }, 900);

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
    }

    // ── Tick ─────────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      simNodes.forEach((d) => {
        const r = d.type === "center" ? 50 : 70;
        d.x = Math.max(r, Math.min(W - r, d.x ?? W / 2));
        d.y = Math.max(r, Math.min(H - r, d.y ?? H / 2));
      });
      (simLinks as any[]).forEach((link, i) => {
        const s = link.source as SimNode,
          t = link.target as SimNode;
        const sx = s.x,
          sy = s.y,
          tx = t.x,
          ty = t.y;
        const mx = (sx + tx) / 2,
          my = (sy + ty) / 2;
        const dx = tx - sx,
          dy = ty - sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const off = len * 0.14; // organic vine curve
        const qx = mx + (-dy / len) * off;
        const qy = my + (dx / len) * off;
        vineEls[i].stem.setAttribute(
          "d",
          `M ${sx} ${sy} Q ${qx} ${qy} ${tx} ${ty}`,
        );

        // Position leaves along the bezier
        const leafDefs: [SVGPathElement, number, number][] = [
          [vineEls[i].leafA, 0.28, 1],
          [vineEls[i].leafB, 0.63, -1],
        ];
        leafDefs.forEach(([leaf, bp, side]) => {
          const bx =
            (1 - bp) * (1 - bp) * sx + 2 * bp * (1 - bp) * qx + bp * bp * tx;
          const by =
            (1 - bp) * (1 - bp) * sy + 2 * bp * (1 - bp) * qy + bp * bp * ty;
          const tdx = 2 * (1 - bp) * (qx - sx) + 2 * bp * (tx - qx);
          const tdy = 2 * (1 - bp) * (qy - sy) + 2 * bp * (ty - qy);
          const angle = (Math.atan2(tdy, tdx) * 180) / Math.PI;
          const perpRad = ((angle + 90) * Math.PI) / 180;
          const px = bx + Math.cos(perpRad) * 5 * side;
          const py = by + Math.sin(perpRad) * 5 * side;
          leaf.setAttribute(
            "transform",
            `translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${(angle + 55 * side).toFixed(1)})`,
          );
        });
      });
      simNodes.forEach((d) => {
        const g = nodeElMap[d.id];
        if (g) g.setAttribute("transform", `translate(${d.x},${d.y})`);
      });
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      W = wrap!.clientWidth;
      H = wrap!.clientHeight;
      setViewBox();
      simulation.alpha(0.3).restart();
    });
    ro.observe(wrap);

    return () => {
      simulation.stop();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative select-none"
      aria-label="Interactive node graph"
    >
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-10">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-40"
        >
          <path
            d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2Z"
            stroke="#8FAF7E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 18C9.5 16.5 10.7 15.5 12 15.5C13.3 15.5 14.5 16.5 15.5 18"
            stroke="#8FAF7E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 22L12 18"
            stroke="#8FAF7E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p
          className="text-[9px] tracking-[0.18em] uppercase pointer-events-none"
          style={{ color: "#9CB891" }}
        >
          Drag to explore
        </p>
      </div>
      <svg
        ref={svgRef}
        className="w-full h-full block"
        aria-label="Force graph"
      />

      {/* ── Closing page animates out (mac-close) ── */}
      {closingPage &&
        createPortal(
          closingPage === "project" ? (
            <ProjectPage onClose={() => {}} origin={null} isClosing={true} />
          ) : closingPage === "about" ? (
            <AboutPage onClose={() => {}} origin={null} isClosing={true} />
          ) : (
            <VisitorGalleryPage onClose={() => {}} isClosing={true} />
          ),
          document.getElementById("canvas-overlay")!,
          `closing-${closingPage}`,
        )}

      {/* ── Active page animates in (mac-open) ── */}
      {activePage &&
        activePage !== closingPage &&
        createPortal(
          activePage === "project" ? (
            <ProjectPage
              onClose={closeCurrentPage}
              origin={pageOrigin}
              isClosing={false}
            />
          ) : activePage === "about" ? (
            <AboutPage
              onClose={closeCurrentPage}
              origin={pageOrigin}
              isClosing={false}
            />
          ) : (
            <VisitorGalleryPage onClose={closeCurrentPage} isClosing={false} />
          ),
          document.getElementById("canvas-overlay")!,
          `active-${activePage}`,
        )}

      {/* ── Node card modal (non-page nodes) ── */}
      {activeNode &&
        createPortal(
          <NodeCard
            node={activeNode}
            onClose={() => setActiveNode(null)}
            origin={nodeOrigin}
            forceClose={isNodeClosing}
          />,
          document.getElementById("canvas-overlay")!,
        )}
      <CursorDot />
    </div>
  );
}

// ── Cursor Dot ────────────────────────────────────────────────────────────────
function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    let raf = 0;

    function move(e: MouseEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot!.style.left = `${e.clientX}px`;
        dot!.style.top = `${e.clientY}px`;
      });
    }

    function onProjectCursor(e: Event) {
      const active = (e as CustomEvent<{ active: boolean }>).detail.active;
      setHovering(active);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("project-cursor", onProjectCursor);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("project-cursor", onProjectCursor);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[9999]"
      style={{ transform: "translate(-50%,-50%)", left: "-20px", top: "-20px" }}
      aria-hidden="true"
    >
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{
          background: hovering ? "#5A7E52" : "#8FAF7E",
          border: hovering ? "none" : "1.5px solid #8FAF7E",
          borderRadius: "9999px",
          mixBlendMode: hovering ? "normal" : "multiply",
          width: hovering ? "196px" : "16px",
          height: hovering ? "48px" : "16px",
        }}
      >
        <span
          className="text-white select-none whitespace-nowrap transition-opacity duration-150"
          style={{
            opacity: hovering ? 1 : 0,
            transitionDelay: hovering ? "80ms" : "0ms",
            fontFamily: "'Inconsolata', 'Courier New', monospace",
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          View case study ↗
        </span>
      </div>
    </div>
  );
}
