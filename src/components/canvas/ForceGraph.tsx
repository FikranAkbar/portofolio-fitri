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
const PROJECT_ITEMS = [
  {
    num: "01",
    title: "Title",
    desc: "Desc",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    role: "Placeholder Role",
    team: "Placeholder Team",
    timeframe: "Jan 2025 - Present",
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
      style={{ transformOrigin, background: "#FAF6EE" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-3 border-b border-[#EDE5D6] shrink-0">
        <button
          onClick={handleClose}
          title="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90
            transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
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
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
        <span className="ml-2 text-sm font-medium text-gray-700 select-none">
          Project
        </span>
        <span className="ml-2 text-sm text-gray-400 select-none">My works</span>
      </div>

      {/* Scrollable grid */}
      <div className="overflow-y-auto p-5 scrollbar-hide flex-1">
        {/* Two independent columns — expand in one column doesn't affect the other */}
        <div className="flex gap-4">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col gap-4 flex-1">
              {PROJECT_ITEMS.filter((_, i) => i % 2 === col).map((p) => (
                <div
                  key={p.num}
                  className="border border-[#DDD3C0] bg-[#FFFDF8] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#8FAF7E] hover:shadow-md"
                  onMouseEnter={() => {
                    setHoveredCard(p.num);
                    window.dispatchEvent(
                      new CustomEvent("project-cursor", {
                        detail: { active: true },
                      }),
                    );
                  }}
                  onMouseLeave={() => {
                    setHoveredCard(null);
                    window.dispatchEvent(
                      new CustomEvent("project-cursor", {
                        detail: { active: false },
                      }),
                    );
                  }}
                >
                  <div className="flex justify-end px-4 pt-1">
                    <span className="text-[12px] font-mono text-[#B8A898] tracking-widest">
                      NO. {p.num}
                    </span>
                  </div>
                  <div
                    className="mx-4 mb-4 bg-[#EDE5D4] rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <span className="text-xs text-[#C4B49A] tracking-wide select-none">
                      Cover Image
                    </span>
                  </div>
                  <div className="px-4 pb-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[18px] font-medium text-gray-800 select-none">
                        {p.title}
                      </p>
                      <div className="flex gap-1 shrink-0">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[13px] bg-[#EAF2E8] text-[#6B9962] border border-[#C5DEBA] px-2 py-0.5 rounded-full select-none"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[15px] text-[#9B8F83] select-none">
                      {p.desc}
                    </p>
                  </div>
                  {/* Expand: Role / Team / Timeframe */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${hoveredCard === p.num ? "max-h-52 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="border-t border-dashed border-[#DDD3C0] mx-4 mt-3 mb-4" />
                    <div className="px-4 pb-4 flex flex-col gap-4">
                      {[
                        { label: "Role", value: p.role },
                        { label: "Team", value: p.team },
                        { label: "Timeframe", value: p.timeframe },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start gap-6 text-[15px]"
                        >
                          <span className="text-[#9B8F83] uppercase tracking-wider font-medium w-28 shrink-0 text-left select-none">
                            {row.label}
                          </span>
                          <span className="text-gray-600 text-left select-none">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
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
    <div className="flex flex-col gap-2">
      {/* Company + Date on same row */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[16px] font-semibold text-gray-800">{company}</p>
        <span className="text-[14px] text-gray-400 shrink-0">{period}</span>
      </div>
      {/* Role */}
      {role && <p className="text-[15px] text-gray-500">{role}</p>}
      {/* Description */}
      <p className="text-[15px] text-gray-500 leading-relaxed">{desc}</p>
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
      style={{ transformOrigin, background: "#FAF6EE" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-3 border-b border-[#EDE5D6] shrink-0">
        <button
          onClick={handleClose}
          title="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90 transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
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
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
        <span className="ml-2 text-sm font-medium text-gray-700 select-none">
          About Me
        </span>
        <span className="ml-2 text-sm text-gray-400 select-none">Who I am</span>
      </div>

      {/* Scrollable body — Medium-style reading column */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-[640px] mx-auto px-8 py-12 flex flex-col gap-10">
          {/* ── Quote ──────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold text-[#9B8F83] uppercase tracking-widest">
              Steve Jobs once said...
            </p>
            <blockquote className="border-l-2 border-[#8FAF7E] pl-5">
              <p className="text-[18px] italic text-gray-700 leading-relaxed font-medium">
                "Design is not just what it looks like and feels like. Design is
                how it works."
              </p>
            </blockquote>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              They remind me that design lives in how people experience it, and
              that's what eventually led me to UI/UX.
            </p>
          </div>

          <hr className="border-[#EDE5D6]" />

          {/* ── Bio ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-gray-700 leading-relaxed">
              <strong className="font-semibold text-gray-900">
                Hi, I'm Fitri Zahwa Januarita, a former illustrator and animator
                who found a new purpose in UI/UX design.
              </strong>
            </p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              I've been drawing since I was a kid and even earned from it in
              high school. But over time, something felt missing — the joy of
              creating started to fade. I wanted my work to matter again. That's
              when I discovered UI/UX. It changed how I see design — not just as
              aesthetics, but as clarity, connection, and impact.
            </p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              My attention to detail, which once slowed me down, now helps me
              craft thoughtful and meaningful experiences. I design from
              real-life struggles. My projects,{" "}
              <strong className="font-semibold text-gray-800">Nabu</strong> (a
              finance tracker) and{" "}
              <strong className="font-semibold text-gray-800">Fishdoro</strong>{" "}
              (a cozy focus timer), are built to help people facing challenges
              similar to mine.
            </p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              I still tell stories, only now they're about users, their needs,
              and how design can make their lives better.
            </p>
          </div>

          <hr className="border-[#EDE5D6]" />

          {/* ── Experience ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            <div className="flex justify-center">
              <span className="px-5 py-1.5 rounded-full border border-[#C5DEBA] text-[14px] font-medium text-[#5A7E52] bg-[#EDF5E8] select-none">
                Experience
              </span>
            </div>
            <div className="flex flex-col gap-8">
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

          <hr className="border-[#EDE5D6]" />

          {/* ── Organization ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            <div className="flex justify-center">
              <span className="px-5 py-1.5 rounded-full border border-[#C5DEBA] text-[14px] font-medium text-[#5A7E52] bg-[#EDF5E8] select-none">
                Organization
              </span>
            </div>
            <div className="flex flex-col gap-8">
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

          <hr className="border-[#EDE5D6]" />

          {/* ── Courses & Certifications ────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            <div className="flex justify-center">
              <span className="px-5 py-1.5 rounded-full border border-[#C5DEBA] text-[14px] font-medium text-[#5A7E52] bg-[#EDF5E8] select-none">
                Courses, Training & Certifications
              </span>
            </div>
            <div className="flex flex-col gap-8">
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

          <hr className="border-[#EDE5D6]" />

          {/* ── Testimonials ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <h2 className="text-[13px] font-semibold text-[#9B8F83] uppercase tracking-widest">
              That's what they said 🩷
            </h2>

            <div className="flex flex-col gap-4">
              {TESTIMONIALS.map((t) => (
                <a
                  key={t.name}
                  href="https://www.fiverr.com/fitrizahwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-[#DDD3C0] bg-[#FFFDF8]
                    overflow-hidden cursor-pointer select-none
                    transition-all duration-200
                    hover:border-[#8FAF7E]/50 hover:shadow-[0_4px_24px_rgba(143,175,126,0.12)] hover:-translate-y-0.5"
                >
                  {/* Subtle green gradient bg on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8FAF7E]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                  {/* Top row: stars + quote mark */}
                  <div className="flex items-center justify-between">
                    {/* 5 stars */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {/* Decorative quote mark */}
                    <span className="text-[32px] leading-none text-[#8FAF7E]/30 font-serif group-hover:text-[#8FAF7E]/60 transition-colors duration-300 -mt-1">
                      "
                    </span>
                  </div>

                  {/* Quote text */}
                  <p className="text-[14px] text-gray-500 leading-relaxed italic">
                    "{t.text}"
                  </p>

                  {/* Divider */}
                  <div className="border-t border-[#EDE5D6]" />

                  {/* Author row */}
                  <div className="flex items-center gap-3">
                    {/* Avatar initial */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8FAF7E]/20 to-[#8FAF7E]/5 flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-semibold text-[#5A7E52]">
                        {t.initial}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0">
                      <span className="text-[14px] font-semibold text-gray-800">
                        {t.name}
                      </span>
                      <span className="text-[12px] text-gray-400">
                        {t.flag} {t.country}
                      </span>
                    </div>
                    {/* Fiverr badge on hover */}
                    <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-[11px] text-gray-400">
                        via Fiverr
                      </span>
                      <svg
                        className="w-3 h-3 text-gray-300"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
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

            {/* Fiverr CTA */}
            <a
              href="https://www.fiverr.com/fitrizahwa"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[#C5DEBA]
                text-[14px] text-[#9B8F83] hover:text-[#5A7E52] hover:border-[#8FAF7E] hover:bg-[#EDF5E8]/50
                transition-all duration-200"
            >
              <span>See all reviews on Fiverr</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

          <hr className="border-[#EDE5D6]" />

          {/* ── Read ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[13px] font-semibold text-[#9B8F83] uppercase tracking-widest">
              Read
            </h2>
            <a
              href="https://fitrizahwa-garden.framer.website/reading"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between px-5 py-4 rounded-xl border border-[#DDD3C0] bg-[#FFFDF8] overflow-hidden transition-all duration-200 hover:border-[#8FAF7E] hover:shadow-md"
            >
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-[#8FAF7E]/8 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3">
                <span className="text-[20px]">📚</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#5A7E52] transition-colors duration-200">
                    Fitri's Garden
                  </span>
                  <span className="text-[13px] text-gray-400">
                    Reading list & notes
                  </span>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-[#5A7E52] transition-colors duration-200 text-[18px]">
                ↗
              </span>
            </a>
          </div>

          {/* Bottom spacer */}
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

const FLOWER_PAL: Record<
  string,
  { p: string; p2: string; c: string; bg: string; border: string }
> = {
  sakura: {
    p: "#FBCFDF",
    p2: "#F472B6",
    c: "#FBBF24",
    bg: "#FFF5F8",
    border: "#F9C0D4",
  },
  lavender: {
    p: "#DDD6FE",
    p2: "#A78BFA",
    c: "#7C3AED",
    bg: "#F5F3FF",
    border: "#C4BBFA",
  },
  daisy: {
    p: "#FEF9C3",
    p2: "#FDE047",
    c: "#D97706",
    bg: "#FEFCE8",
    border: "#FDE68A",
  },
  sunflower: {
    p: "#FDE68A",
    p2: "#F59E0B",
    c: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  forgetmenot: {
    p: "#BFDBFE",
    p2: "#60A5FA",
    c: "#FBBF24",
    bg: "#EFF6FF",
    border: "#93C5FD",
  },
  rose: {
    p: "#FECDD3",
    p2: "#FB7185",
    c: "#BE123C",
    bg: "#FFF1F2",
    border: "#FECDD3",
  },
  cosmos: {
    p: "#FBCFE8",
    p2: "#F9A8D4",
    c: "#FBBF24",
    bg: "#FDF2F8",
    border: "#F9C0E2",
  },
};

function FlowerSvg({ type, size = 64 }: { type: string; size?: number }) {
  const pal = FLOWER_PAL[type] ?? FLOWER_PAL.daisy;
  const hw = size / 2;
  const stemTop = size * 0.4;

  if (type === "lavender") {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <line
          x1={hw}
          y1={stemTop * 0.55}
          x2={hw}
          y2={size - 2}
          stroke="#8FAF7E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {[0.18, 0.26, 0.34, 0.42, 0.5].map((t, i) => (
          <React.Fragment key={i}>
            <ellipse
              cx={hw - 6}
              cy={size * t}
              rx={4}
              ry={2.5}
              fill={pal.p}
              transform={`rotate(-25,${hw - 6},${size * t})`}
            />
            <ellipse
              cx={hw + 6}
              cy={size * (t + 0.04)}
              rx={4}
              ry={2.5}
              fill={pal.p2}
              transform={`rotate(25,${hw + 6},${size * (t + 0.04)})`}
            />
          </React.Fragment>
        ))}
        <ellipse cx={hw} cy={size * 0.12} rx={3.5} ry={5.5} fill={pal.p2} />
      </svg>
    );
  }

  const configs: Record<
    string,
    { n: number; rx: number; ry: number; dist: number }
  > = {
    sakura: { n: 5, rx: 7, ry: 5, dist: 9 },
    daisy: { n: 10, rx: 9, ry: 3.5, dist: 10 },
    sunflower: { n: 14, rx: 8, ry: 3, dist: 11 },
    forgetmenot: { n: 5, rx: 5, ry: 4, dist: 7 },
    rose: { n: 6, rx: 8, ry: 6, dist: 8 },
    cosmos: { n: 8, rx: 9, ry: 3.5, dist: 10 },
  };
  const { n, rx, ry, dist } = configs[type] ?? { n: 5, rx: 7, ry: 5, dist: 9 };
  const centerR = type === "sunflower" ? 9 : 5;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      <line
        x1={hw}
        y1={stemTop + 4}
        x2={hw}
        y2={size - 2}
        stroke="#8FAF7E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {Array.from({ length: n }, (_, i) => {
        const angle = (360 / n) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const cx = hw + Math.cos(rad) * dist;
        const cy = stemTop + Math.sin(rad) * dist;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={i % 2 === 0 ? pal.p : pal.p2}
            stroke={pal.p2}
            strokeWidth="0.3"
            transform={`rotate(${angle + 90},${cx},${cy})`}
          />
        );
      })}
      <circle cx={hw} cy={stemTop} r={centerR} fill={pal.c} />
    </svg>
  );
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

  // Fetch real visitor blooms from Supabase on mount (max 50 displayed, but count all)
  useEffect(() => {
    // Fetch total count
    supabase
      .from("blooms")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        setTotalCount(count ?? 0);
      });
    // Fetch latest 50 to display
    supabase
      .from("blooms")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
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
      style={{ transformOrigin: "center center", background: "#FAF6EE" }}
    >
      {/* ── Window chrome ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-3 border-b border-[#EDE5D6] shrink-0">
        <button
          onClick={handleClose}
          title="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90 transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
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
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
        <span className="ml-2 text-sm font-medium text-gray-700 select-none">
          Visitor Gallery
        </span>
        <span className="ml-2 text-sm text-gray-400 select-none">
          Bloomed with love 🌿
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[13px] text-gray-400 select-none">
            My corner
          </span>
          <div className="w-7 h-7 rounded-full bg-[#E8DDD0] flex items-center justify-center text-[13px]">
            🌿
          </div>
        </div>
      </div>

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-[22px] font-bold text-gray-800 select-none">
            Visitor Gallery
          </h2>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8FAF7E] bg-[#EDF5E8] px-3 py-1 rounded-full border border-[#C5DEBA] select-none">
            {loading
              ? "Loading…"
              : `${totalCount ?? blooms.length} bloom${(totalCount ?? blooms.length) !== 1 ? "s" : ""} planted`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6CCB8] bg-white text-[12px] text-gray-600 hover:bg-[#F5F0E6] transition-colors duration-150 select-none">
            Edit my card <span>✏️</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6CCB8] bg-white text-[12px] text-gray-600 hover:bg-[#F5F0E6] transition-colors duration-150 select-none">
            Shuffle <span>🔀</span>
          </button>
        </div>
      </div>

      {/* ── Main body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden gap-3 px-6 pb-0 min-h-0 relative">
        {/* Loading overlay */}
        {loading && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl"
            style={{
              background: "rgba(250,246,238,0.88)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="flex items-end gap-1.5">
              {[0, 0.15, 0.3].map((delay, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#8FAF7E]"
                  style={{
                    animation: `vg-bounce 0.9s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
            <p
              className="text-[11px] text-[#8FAF7E] tracking-widest uppercase font-medium select-none"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              Growing the garden…
            </p>
            <style>{`
              @keyframes vg-bounce {
                0%, 100% { transform: translateY(0); opacity: 0.5; }
                50% { transform: translateY(-6px); opacity: 1; }
              }
            `}</style>
          </div>
        )}
        {/* Garden canvas */}
        <div
          className="flex-1 relative rounded-xl overflow-hidden border border-[#DCCFB6]"
          style={{
            background:
              "radial-gradient(ellipse at 60% 35%, #F7EED8 0%, #EAE0C6 100%)",
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
                  className={`transition-transform duration-200 drop-shadow-sm ${isHov ? "scale-110 -translate-y-1" : ""}`}
                >
                  <FlowerSvg type={bloom.flower} size={64} />
                </div>
                {isHov && (
                  <div
                    className="absolute z-20 bg-white/96 rounded-xl shadow-lg border border-[#EDE5D6] px-3 py-2.5 w-44 pointer-events-none"
                    style={{
                      [tipAbove ? "bottom" : "top"]: "calc(100% + 10px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <p className="text-[13px] font-semibold text-gray-800 select-none leading-tight">
                      {bloom.flowerName}
                    </p>
                    <p className="text-[12px] text-gray-500 select-none mt-0.5">
                      {bloom.name} <span className="text-[10px]">✏️</span>
                    </p>
                    <p className="text-[11px] text-gray-400 select-none mt-0.5">
                      {bloom.date}
                    </p>
                    <p className="text-[11px] text-gray-500 italic select-none mt-1.5 border-t border-gray-100 pt-1.5 leading-relaxed">
                      {bloom.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: visitor card list */}
        <div className="w-[252px] overflow-y-auto shrink-0 flex flex-col gap-2.5 pb-4 scrollbar-hide">
          {blooms.map((bloom) => {
            const pal = FLOWER_PAL[bloom.flower] ?? FLOWER_PAL.daisy;
            return (
              <div
                key={bloom.id}
                className="rounded-xl border px-3 pt-2.5 pb-2 flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer select-none"
                style={{ background: pal.bg, borderColor: pal.border }}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="shrink-0 w-11 flex items-end justify-center">
                    <FlowerSvg type={bloom.flower} size={54} />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                      {bloom.flowerName}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      by {bloom.name}{" "}
                      <span className="opacity-60 text-[10px]">✏️</span>
                    </p>
                    <p className="text-[12px] text-gray-600 leading-relaxed mt-0.5">
                      {bloom.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-end justify-between pt-1.5 border-t border-black/5 mt-0.5">
                  <div>
                    <p className="text-[11px] text-gray-400">{bloom.date}</p>
                    <p className="text-[10px] text-gray-300">No. {bloom.num}</p>
                  </div>
                  <p
                    className="text-[14px] text-gray-400/70"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontStyle: "italic",
                    }}
                  >
                    {bloom.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer stats ───────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-stretch border-t border-[#EDE5D6] mt-3"
        style={{ background: "rgba(245,239,223,0.7)" }}
      >
        <div className="flex items-center gap-3 px-5 py-3 flex-1">
          <span className="text-2xl opacity-70">🌿</span>
          <div>
            <p className="text-[17px] font-bold text-gray-700 leading-none select-none">
              {totalCount ?? blooms.length}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 select-none">
              Blooms planted so far
            </p>
          </div>
        </div>
        <div className="w-px bg-[#EDE5D6]" />
        <div className="flex items-center px-5 py-3 flex-1">
          <p className="text-[12px] text-gray-500 leading-relaxed select-none">
            Every flower here was planted
            <br />
            by a visitor with a kind heart.
          </p>
        </div>
        <div className="w-px bg-[#EDE5D6]" />
        <div className="flex items-center gap-2 px-5 py-3 flex-1">
          <span className="text-lg">🦋</span>
          <p className="text-[12px] text-gray-500 select-none">
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
          size: 15,
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
        numEl.setAttribute("font-size", "11");
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
        desc.setAttribute("font-size", "11");
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
