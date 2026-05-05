import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
} from 'd3-force';

// ─── Types ──────────────────────────────────────────────────────────────────
type NodeDef = {
  id: string;
  label: string;
  sublabel?: string;
  desc?: string;
  type: 'center' | 'branch';
};
type SimNode = NodeDef & {
  x: number; y: number;
  vx: number; vy: number;
  fx: number | null; fy: number | null;
};
type SimLink = { source: string | SimNode; target: string | SimNode };

// ─── Constants ───────────────────────────────────────────────────────────────
const NODES: NodeDef[] = [
  { id: 'center',    label: 'Fitri Zahwa', sublabel: 'Indonesia',  type: 'center' },
  { id: 'about',     label: 'About',       desc: 'Who I am',       type: 'branch' },
  { id: 'resume',    label: 'Resume',      desc: 'My experience',  type: 'branch' },
  { id: 'project',   label: 'Project',     desc: 'My works',       type: 'branch' },
  { id: 'testimony', label: 'Testimony',   desc: 'What they say',  type: 'branch' },
  { id: 'read',      label: 'Read',        desc: 'My reading list',type: 'branch' },
  { id: 'listen',    label: 'Listen',      desc: 'What I hear',    type: 'branch' },
  { id: 'watch',     label: 'Watch',       desc: 'What I watch',   type: 'branch' },
  { id: 'drawing',   label: 'Drawing',     desc: 'My sketches',    type: 'branch' },
  { id: 'pixelart',  label: 'Pixel-Art',   desc: 'My pixel art',   type: 'branch' },
];

const LINKS: { source: string; target: string }[] = [
  { source: 'center', target: 'about'     },
  { source: 'center', target: 'resume'    },
  { source: 'center', target: 'project'   },
  { source: 'center', target: 'testimony' },
  { source: 'center', target: 'read'      },
  { source: 'center', target: 'listen'    },
  { source: 'center', target: 'watch'     },
  { source: 'center', target: 'drawing'   },
  { source: 'center', target: 'pixelart'  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ns  = 'http://www.w3.org/2000/svg';
const el  = (tag: string) => document.createElementNS(ns, tag);
const txt = (
  content: string,
  opts: { size?: number; weight?: number; fill?: string; anchor?: string; dy?: number }
) => {
  const t = el('text');
  t.setAttribute('font-family', 'Inter, system-ui, sans-serif');
  t.setAttribute('font-size',   String(opts.size   ?? 16));
  t.setAttribute('font-weight', String(opts.weight ?? 400));
  t.setAttribute('fill',        opts.fill   ?? '#000000');
  t.setAttribute('text-anchor', opts.anchor ?? 'middle');
  t.setAttribute('dominant-baseline', 'middle');
  t.setAttribute('pointer-events', 'none');
  if (opts.dy !== undefined) t.setAttribute('dy', String(opts.dy));
  t.textContent = content;
  return t;
};

const LOCATION_ICON_PATH = 'M18.2961 4.63699C17.4832 3.78975 16.5074 3.11561 15.4274 2.65509C14.3473 2.19457 13.1853 1.95715 12.0111 1.95715C10.837 1.95715 9.67495 2.19457 8.59489 2.65509C7.51482 3.11561 6.53902 3.78975 5.72613 4.63699C4.19613 6.63699 3.72613 9.63698 4.58613 12.717C5.46613 16.047 7.81612 18.457 9.70612 20.387L10.6261 21.387C10.8048 21.5766 11.0188 21.7295 11.2561 21.837C11.4938 21.9426 11.751 21.9971 12.0111 21.9971C12.2712 21.9971 12.5284 21.9426 12.7661 21.837C12.999 21.7313 13.2095 21.582 13.3861 21.397L14.3161 20.397C16.2061 18.467 18.5561 16.057 19.4361 12.727C20.2461 9.63699 19.8261 6.63699 18.2961 4.63699ZM12.0061 12.887C11.3178 12.887 10.645 12.6829 10.0727 12.3005C9.50046 11.9181 9.05442 11.3746 8.79102 10.7387C8.52763 10.1029 8.45872 9.40314 8.59299 8.72809C8.72727 8.05303 9.0587 7.43295 9.54539 6.94626C10.0321 6.45957 10.6521 6.12814 11.3272 5.99387C12.0023 5.85959 12.702 5.9285 13.3379 6.19189C13.9738 6.45529 14.5172 6.90132 14.8996 7.4736C15.282 8.04589 15.4861 8.7187 15.4861 9.40698C15.4861 9.86351 15.396 10.3156 15.221 10.7372C15.046 11.1589 14.7895 11.5418 14.4663 11.8642C14.143 12.1865 13.7593 12.4419 13.3371 12.6157C12.915 12.7895 12.4627 12.8783 12.0061 12.877V12.887Z';

// ─── Project Page Overlay ────────────────────────────────────────────────────
const PROJECT_ITEMS = [
  { num: '01', title: 'Title', desc: 'Desc', tags: ['Tag 1', 'Tag 2', 'Tag 3'], role: 'Placeholder Role', team: 'Placeholder Team', timeframe: 'Jan 2025 - Present' },
  { num: '02', title: 'Title', desc: 'Desc', tags: ['Tag 1', 'Tag 2', 'Tag 3'], role: 'Placeholder Role', team: 'Placeholder Team', timeframe: 'Mar 2025 - Jun 2025' },
  { num: '03', title: 'Title', desc: 'Desc', tags: ['Tag 1', 'Tag 2', 'Tag 3'], role: 'Placeholder Role', team: 'Placeholder Team', timeframe: 'Jul 2024 - Dec 2024' },
  { num: '04', title: 'Title', desc: 'Desc', tags: ['Tag 1', 'Tag 2', 'Tag 3'], role: 'Placeholder Role', team: 'Placeholder Team', timeframe: 'Aug 2023 - Feb 2024' },
];

function ProjectPage({ onClose, origin, isClosing: forcedClosing }: { onClose: () => void; origin: { x: number; y: number } | null; isClosing?: boolean }) {
  const [closing, setClosing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }

  const isClosing = closing || forcedClosing;
  const transformOrigin = origin ? `${origin.x}px ${origin.y}px` : 'center center';

  return (
    <div
      className={`absolute inset-6 z-20 bg-white rounded-2xl flex flex-col overflow-hidden shadow-lg ${isClosing ? 'mac-close' : 'mac-open'}`}
      style={{ transformOrigin }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        <button
          onClick={handleClose}
          title="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90
            transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
          aria-label="Close"
        >
          <svg className="w-1.5 h-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
            viewBox="0 0 8 8" fill="none" stroke="#7A0000" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="7" y2="7" /><line x1="7" y1="1" x2="1" y2="7" />
          </svg>
        </button>
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
        <span className="ml-2 text-sm font-medium text-gray-800 select-none">Project</span>
        <span className="ml-2 text-sm text-gray-400 select-none">My works</span>
      </div>

      {/* Scrollable grid */}
      <div className="overflow-y-auto p-5 scrollbar-hide flex-1">
      {/* Two independent columns — expand in one column doesn't affect the other */}
        <div className="flex gap-4">
          {[0, 1].map(col => (
            <div key={col} className="flex flex-col gap-4 flex-1">
              {PROJECT_ITEMS.filter((_, i) => i % 2 === col).map(p => (
                <div
                  key={p.num}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#E73AA4] hover:shadow-md"
                  onMouseEnter={() => {
                    setHoveredCard(p.num);
                    window.dispatchEvent(new CustomEvent('project-cursor', { detail: { active: true } }));
                  }}
                  onMouseLeave={() => {
                    setHoveredCard(null);
                    window.dispatchEvent(new CustomEvent('project-cursor', { detail: { active: false } }));
                  }}
                >
                  <div className="flex justify-end px-4 pt-1">
                    <span className="text-[12px] font-mono text-gray-300 tracking-widest">NO. {p.num}</span>
                  </div>
                  <div className="mx-4 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                    <span className="text-xs text-gray-300 tracking-wide select-none">Cover Image</span>
                  </div>
                  <div className="px-4 pb-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[18px] font-medium text-gray-800 select-none">{p.title}</p>
                      <div className="flex gap-1 shrink-0">
                        {p.tags.map(tag => (
                          <span key={tag} className="text-[14px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full select-none">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[16px] text-gray-400 select-none">{p.desc}</p>
                  </div>
                  {/* Expand: Role / Team / Timeframe */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hoveredCard === p.num ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-dashed border-gray-200 mx-4 mt-3 mb-4" />
                    <div className="px-4 pb-4 flex flex-col gap-4">
                      {[
                        { label: 'Role',      value: p.role      },
                        { label: 'Team',      value: p.team      },
                        { label: 'Timeframe', value: p.timeframe },
                      ].map(row => (
                        <div key={row.label} className="flex items-start gap-6 text-[16px]">
                          <span className="text-gray-400 uppercase tracking-wider font-medium w-28 shrink-0 text-left select-none">{row.label}</span>
                          <span className="text-gray-600 text-left select-none">{row.value}</span>
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
    period: 'May 2020 – Present',
    company: 'Fiverr Platform',
    role: 'Freelance Illustrator and Animator',
    desc: 'Completed 150+ illustration and animation projects for international clients, specializing in hand-drawn and pixel art. Built strong client relationships through reliable delivery, clear communication, and consistent quality across diverse project scopes.',
    highlight: null,
  },
  {
    period: 'Jun 2022 – Nov 2022',
    company: 'Cuatrodia Creative',
    role: 'Intern 2D Motion Artist',
    desc: 'Assisted in developing 2D animations for short films, event visuals, and promotional materials. Contributed to the opening animation showcased at the',
    highlight: '2022 G20 Summit in Bali',
    highlightSuffix: ', supporting the branding of a high-profile international event.',
  },
  {
    period: 'Aug 2021 – Dec 2021',
    company: 'Zenius Education',
    role: 'Intern Storyboard Artist',
    desc: "Created storyboards and thumbnails for Zenius Education's original educational series, ensuring engaging and effective visual storytelling. Translated complex academic topics into accessible narratives for primary and secondary school audiences, while also mentoring fellow interns by providing feedback and suggestions to improve overall team quality.",
    highlight: null,
  },
  {
    period: 'Sep 2020 – Dec 2021',
    company: 'MSV Studio',
    role: 'Junior 2D Animator',
    desc: 'Completed a 9-month internship specializing in 2D animation techniques, cut-out workflows, and production pipelines. Continued as a contract 2D animator for 3 months, delivering high-quality animation assets for client projects under tight deadlines.',
    highlight: null,
  },
];

const ABOUT_ORGS = [
  {
    period: 'Sep 2020 – Dec 2021',
    company: 'Amikom Computer Club',
    role: '',
    desc: 'Collaborated with a team of five to maintain design consistency across Instagram, Twitter, and LinkedIn. Conducted workshops for new members, introducing fundamental front-end development concepts and design tools. Also managed public relations and documented campus events to boost organizational visibility.',
  },
];

const ABOUT_COURSES = [
  {
    period: 'Feb 2025 – Aug 2025',
    company: 'Harisenin.com',
    role: 'UX Design Bootcamp',
    desc: 'Completed a comprehensive UX design bootcamp focused on UX research and product management. As the final project, conducted UX research and design for a Finance Tracking App for Young Adults, covering the full process from research methods and persona building to UI design, wireframing, prototyping, and Figma.',
  },
  {
    period: 'Jan 2025 – Jun 2025',
    company: 'Uxcel',
    role: 'UI/UX Design Courses',
    desc: 'Completed multiple UI/UX design courses to build a strong foundation in design principles and practical skills. Topics included UX foundations, UI components, accessibility, common design patterns, wireframing, design terminology, composition, color psychology, and typography.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Akraal',
    country: 'Sweden',
    text: '"Really great experience working with Fitri Zahwa. The delivery took a bit longer, but it was absolutely worth the wait. She was professional, friendly, and handled the whole process in a very smooth and respectful way. What I appreciated most was her willingness to step outside her comfort zone for this project, and she still delivered with real quality and care. Very happy with the final result, and I\'d gladly work with her again."',
  },
  {
    name: 'aubinrauffet671',
    country: 'France',
    text: '"I had the pleasure of working with Fitri, and I\'m beyond impressed! From start to finish, Fitri was an excellent communicator, always engaging with me to ensure every detail was perfect. They went above and beyond to make sure the final result exceeded my expectations. Truly a dedicated and talented professional who is committed to delivering the best work possible. Highly recommend! Thank you for the great work!"',
  },
  {
    name: 'Aleynatuna',
    country: 'Turkey',
    text: '"It was very easy to communicate with her. Although we did not agree on exactly what I wanted at first, when I explained it again, she understood what I was expecting from the work very well and made the drawing I wanted extremely good. She was very polite and understanding in every conversation we had. I am also pleased with how detailed the drawing is. I am happy to work with her, I am sure that our work will continue."',
  },
];

function TimelineItem({ period, company, role, desc }: { period: string; company: string; role: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-gray-400">{period}</span>
      <p className="text-[16px] font-semibold text-gray-800">{company}{role ? `, ${role}` : ''}</p>
      <p className="text-[15px] text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function AboutPage({ onClose, origin, isClosing: forcedClosing }: { onClose: () => void; origin: { x: number; y: number } | null; isClosing?: boolean }) {
  const [closing, setClosing] = useState(false);
  function handleClose() { setClosing(true); setTimeout(onClose, 200); }
  const isClosing = closing || forcedClosing;
  const transformOrigin = origin ? `${origin.x}px ${origin.y}px` : 'center center';

  return (
    <div
      className={`absolute inset-6 z-20 bg-white rounded-2xl flex flex-col overflow-hidden shadow-lg ${isClosing ? 'mac-close' : 'mac-open'}`}
      style={{ transformOrigin }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        <button onClick={handleClose} title="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90 transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
          aria-label="Close">
          <svg className="w-1.5 h-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
            viewBox="0 0 8 8" fill="none" stroke="#7A0000" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="7" y2="7" /><line x1="7" y1="1" x2="1" y2="7" />
          </svg>
        </button>
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
        <span className="ml-2 text-sm font-medium text-gray-800 select-none">About Me</span>
        <span className="ml-2 text-sm text-gray-400 select-none">Who I am</span>
      </div>

      {/* Scrollable body — Medium-style reading column */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-[640px] mx-auto px-8 py-12 flex flex-col gap-10">

          {/* ── Quote ──────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">Steve Jobs once said...</p>
            <blockquote className="border-l-2 border-[#E73AA4] pl-5">
              <p className="text-[18px] italic text-gray-700 leading-relaxed font-medium">
                "Design is not just what it looks like and feels like. Design is how it works."
              </p>
            </blockquote>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              They remind me that design lives in how people experience it, and that's what eventually led me to UI/UX.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* ── Bio ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-gray-700 leading-relaxed">
              <strong className="font-semibold text-gray-900">Hi, I'm Fitri Zahwa Januarita, a former illustrator and animator who found a new purpose in UI/UX design.</strong>
            </p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              I've been drawing since I was a kid and even earned from it in high school. But over time, something felt missing — the joy of creating started to fade. I wanted my work to matter again. That's when I discovered UI/UX. It changed how I see design — not just as aesthetics, but as clarity, connection, and impact.
            </p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              My attention to detail, which once slowed me down, now helps me craft thoughtful and meaningful experiences. I design from real-life struggles. My projects, <strong className="font-semibold text-gray-800">Nabu</strong> (a finance tracker) and <strong className="font-semibold text-gray-800">Fishdoro</strong> (a cozy focus timer), are built to help people facing challenges similar to mine.
            </p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              I still tell stories, only now they're about users, their needs, and how design can make their lives better.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* ── Experience ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">Experience</h2>
            <div className="flex flex-col gap-7">
              {ABOUT_EXPERIENCE.map(item => (
                <TimelineItem key={item.company + item.period}
                  period={item.period} company={item.company}
                  role={item.role} desc={item.desc}
                />
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── Organization ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">Organization</h2>
            <div className="flex flex-col gap-7">
              {ABOUT_ORGS.map(item => (
                <TimelineItem key={item.company} period={item.period}
                  company={item.company} role={item.role} desc={item.desc} />
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── Courses & Certifications ────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">Courses, Training & Certifications</h2>
            <div className="flex flex-col gap-7">
              {ABOUT_COURSES.map(item => (
                <TimelineItem key={item.company} period={item.period}
                  company={item.company} role={item.role} desc={item.desc} />
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── Testimonials ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">That's what they said 🩷</h2>
            <div className="flex flex-col gap-4">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="flex flex-col gap-2 bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-[15px] text-gray-600 leading-relaxed italic">{t.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[14px] font-semibold text-gray-800">{t.name}</span>
                    <span className="text-[13px] text-gray-400">{t.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── Read ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">Read</h2>
            <a
              href="https://fitrizahwa-garden.framer.website/reading"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between px-5 py-4 rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:border-[#E73AA4] hover:shadow-md"
            >
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-[#E73AA4]/8 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3">
                <span className="text-[20px]">📚</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#E73AA4] transition-colors duration-200">Fitri's Garden</span>
                  <span className="text-[13px] text-gray-400">Reading list & notes</span>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-[#E73AA4] transition-colors duration-200 text-[18px]">↗</span>
            </a>
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

// ─── Visitor Gallery Page ─────────────────────────────────────────────────────
function VisitorGalleryPage({ onClose, isClosing: forcedClosing }: { onClose: () => void; isClosing?: boolean }) {
  const [closing, setClosing] = useState(false);
  function handleClose() { setClosing(true); setTimeout(onClose, 200); }
  const isClosing = closing || forcedClosing;
  return (
    <div
      className={`absolute inset-6 z-20 bg-white rounded-2xl flex flex-col overflow-hidden shadow-lg ${isClosing ? 'mac-close' : 'mac-open'}`}
      style={{ transformOrigin: 'center center' }}
    >
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        <button onClick={handleClose} title="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90 transition-all duration-100 flex items-center justify-center focus:outline-none group/dot"
          aria-label="Close">
          <svg className="w-1.5 h-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
            viewBox="0 0 8 8" fill="none" stroke="#7A0000" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="7" y2="7" /><line x1="7" y1="1" x2="1" y2="7" />
          </svg>
        </button>
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
        <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
        <span className="ml-2 text-sm font-medium text-gray-800 select-none">Visitor Gallery</span>
        <span className="ml-2 text-sm text-gray-400 select-none">Leave your mark</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
        <p className="text-gray-400 text-sm tracking-wide select-none">Content coming soon</p>
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
  const [closing, setClosing]       = useState(false);
  const [pos, setPos]               = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef        = useRef<HTMLDivElement>(null);
  const offsetRef      = useRef({ x: 0, y: 0 });
  const justDraggedRef = useRef(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }

  const isClosing = closing || forceClose;
  const transformOrigin = origin ? `${origin.x}px ${origin.y}px` : 'center center';

  // ── Drag from chrome bar ────────────────────────────────────────────────
  function onChromeMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    const card = cardRef.current;
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const container = card.closest('[data-card-container]') as HTMLElement | null;
    const cRect = container?.getBoundingClientRect() ?? { left: 0, top: 0 };

    // Snap to absolute coordinates within canvas-overlay on first drag
    setPos({ x: cardRect.left - cRect.left, y: cardRect.top - cRect.top });
    offsetRef.current = { x: e.clientX - cardRect.left, y: e.clientY - cardRect.top };
    setIsDragging(true);

    function onMove(ev: MouseEvent) {
      const c = (card!.closest('[data-card-container]') as HTMLElement | null)?.getBoundingClientRect() ?? { left: 0, top: 0 };
      setPos({ x: ev.clientX - c.left - offsetRef.current.x, y: ev.clientY - c.top - offsetRef.current.y });
    }
    function onUp() {
      setIsDragging(false);
      justDraggedRef.current = true;
      setTimeout(() => { justDraggedRef.current = false; }, 100);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
  }

  return (
    <div
      data-card-container=""
      className={`absolute inset-0 z-20 ${isClosing ? 'backdrop-out' : 'backdrop-in'}`}
    >
      {/* Backdrop – click to close */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"
        onClick={() => { if (!justDraggedRef.current) handleClose(); }}
      />

      {/* Card wrapper – centered initially, freely positioned after first drag */}
      <div
        className={pos ? 'absolute' : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        style={pos ? { left: pos.x, top: pos.y } : {}}
      >
        <div
          ref={cardRef}
          className={`relative bg-white border border-gray-200 rounded-2xl shadow-xl w-[420px] max-w-[90vw] overflow-hidden ${isClosing ? 'mac-close' : 'mac-open'}`}
          style={{ transformOrigin: pos ? 'center center' : transformOrigin }}
          onClick={e => e.stopPropagation()}
        >
          {/* Window chrome — drag handle */}
          <div
            className="group/chrome flex items-center gap-1.5 px-4 pt-4 pb-3 border-b border-gray-100 select-none"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={onChromeMouseDown}
          >
            <button
              onClick={e => { e.stopPropagation(); handleClose(); }}
              onMouseDown={e => e.stopPropagation()}
              title="Close"
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 active:scale-90
                transition-all duration-100 flex items-center justify-center
                focus:outline-none group/dot"
              aria-label="Close"
            >
              <svg
                className="w-1.5 h-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-100"
                viewBox="0 0 8 8" fill="none" stroke="#7A0000" strokeWidth="1.5" strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="7" y2="7" />
                <line x1="7" y1="1" x2="1" y2="7" />
              </svg>
            </button>
            <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Minimize" />
            <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" title="Maximize" />
            <span className="ml-2 text-sm font-medium text-gray-800">Title</span>
            <span className="ml-2 text-sm text-gray-400">Description</span>
          </div>

          {/* Body */}
          <div className="px-6 py-8 flex flex-col items-center gap-3 min-h-[200px] justify-center">
            <p className="text-gray-400 text-sm tracking-wide select-none">Content coming soon</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 pb-4">
            <button
              onClick={handleClose}
              className="select-none px-5 py-2 rounded-lg text-sm font-medium text-white
                bg-[#E73AA4] hover:bg-[#d42e93] active:scale-95 active:bg-[#c0287f]
                transition-all duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ForceGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);

  // ── Page Panel state ──────────────────────────────────────────────────────
  const [activePage, setActivePage]   = useState<string | null>(null);
  const [closingPage, setClosingPage] = useState<string | null>(null);
  const [pageOrigin, setPageOrigin]   = useState<{ x: number; y: number } | null>(null);
  // Ref to track current active page without stale-closure issues in effects
  const pageRef = useRef<{ active: string | null; timer: ReturnType<typeof setTimeout> | null }>({ active: null, timer: null });

  // ── Node Card state ───────────────────────────────────────────────────────
  const [activeNode, setActiveNode]   = useState<NodeDef | null>(null);
  const [nodeOrigin, setNodeOrigin]   = useState<{ x: number; y: number } | null>(null);
  const [isNodeClosing, setIsNodeClosing] = useState(false);

  // ── Page helpers (stable: only call stable setters + pageRef) ─────────────
  function openPage(id: string, origin: { x: number; y: number } | null = null) {
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
      window.dispatchEvent(new CustomEvent('page-closed'));
    }, 200);
  }

  // ── Page & navigation event listeners ────────────────────────────────────
  useEffect(() => {
    function handleOpenPage(e: Event) {
      const { page, origin } = (e as CustomEvent<{ page: string; origin?: { x: number; y: number } | null }>).detail;
      openPage(page, origin ?? null);
      window.dispatchEvent(new CustomEvent('page-nav-update', { detail: { page } }));
    }
    // Backward compat: old 'open-project-page' event
    function handleOpenProjectLegacy(e: Event) {
      const origin = (e as CustomEvent).detail?.origin ?? null;
      openPage('project', origin);
      window.dispatchEvent(new CustomEvent('page-nav-update', { detail: { page: 'project' } }));
    }
    function handleNavigateHome() {
      closeCurrentPage();
      setIsNodeClosing(true);
      setTimeout(() => { setActiveNode(null); setIsNodeClosing(false); }, 200);
    }
    window.addEventListener('open-page',         handleOpenPage);
    window.addEventListener('open-project-page', handleOpenProjectLegacy);
    window.addEventListener('navigate-home',     handleNavigateHome);
    return () => {
      window.removeEventListener('open-page',         handleOpenPage);
      window.removeEventListener('open-project-page', handleOpenProjectLegacy);
      window.removeEventListener('navigate-home',     handleNavigateHome);
    };
  }, []);

  // ── Main simulation ───────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    const svg  = svgRef.current;
    if (!wrap || !svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    let W = wrap.clientWidth  || 900;
    let H = wrap.clientHeight || 600;

    const setViewBox = () => svg!.setAttribute('viewBox', `0 0 ${W} ${H}`);
    setViewBox();

    // ── Simulation ────────────────────────────────────────────────────────────
    const simNodes: SimNode[] = NODES.map((n, i) => ({
      ...n,
      x: W / 2 + (i === 0 ? 0 : (Math.random() - 0.5) * 300),
      y: H / 2 + (i === 0 ? 0 : (Math.random() - 0.5) * 220),
      vx: 0, vy: 0, fx: null, fy: null,
    }));

    const simLinks: SimLink[] = LINKS.map(l => ({ ...l }));

    const simulation = forceSimulation<SimNode>(simNodes)
      .force('link',    forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(180).strength(0.06))
      .force('charge',  forceManyBody().strength(-260))
      .force('collide', forceCollide<SimNode>().radius(72).strength(0.7))
      .alphaDecay(0)      // don't auto-decay — orbital force keeps it alive
      .velocityDecay(0.38)
      .alphaTarget(0.08)  // run forever at low energy
      .alphaMin(0);

    // Per-node orbital speed multiplier (slight variation = natural feel)
    const orbitSpeed: Record<string, number> = {};
    simNodes.forEach(d => {
      if (d.type === 'branch') orbitSpeed[d.id] = 0.75 + Math.random() * 0.5;
    });

    const ORBIT_FORCE = 0.14; // tangential acceleration per tick (halved for slower orbit)

    // ── Orbital force (applied every tick by d3) ──────────────────────────────
    simulation.force('orbital', () => {
      if (dragging) return;
      const center = simNodes.find(n => n.id === 'center')!;
      const cx = center.x ?? W / 2;
      const cy = center.y ?? H / 2;
      simNodes.forEach(d => {
        if (d.type !== 'branch') return;
        const dx = (d.x ?? 0) - cx;
        const dy = (d.y ?? 0) - cy;
        const r   = Math.sqrt(dx * dx + dy * dy) || 1;
        const spd = ORBIT_FORCE * (orbitSpeed[d.id] ?? 1);
        // Counter-clockwise tangential unit vector: (-dy/r, dx/r)
        d.vx = (d.vx ?? 0) + (-dy / r) * spd;
        d.vy = (d.vy ?? 0) + (dx  / r) * spd;
      });
    });

    // ── Groups ────────────────────────────────────────────────────────────────
    const linkG = el('g'); svg.appendChild(linkG);
    const nodeG = el('g'); svg.appendChild(nodeG);

    // ── Links ─────────────────────────────────────────────────────────────────
    const linkEls = simLinks.map(() => {
      const line = el('line');
      line.setAttribute('stroke', '#6B6B6B');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '6 4');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0.85');
      (line as SVGLineElement).style.transition = 'opacity 0.25s ease';
      linkG.appendChild(line);
      return line;
    });

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const nodeElMap: Record<string, SVGGElement> = {};

    simNodes.forEach(d => {
      const g = el('g') as SVGGElement;
      nodeElMap[d.id] = g;

      if (d.type === 'center') {
        g.style.cursor = 'grab';

        const circ = el('circle');
        circ.setAttribute('r', '30');
        circ.setAttribute('fill', '#ffffff');
        circ.setAttribute('stroke', '#000000');
        circ.setAttribute('stroke-width', '1');

        const name = txt(d.label, { size: 18, weight: 700, fill: '#000000', dy: 50 });

        // Location row: mage location-pin icon + country text
        const locGroup = el('g') as SVGGElement;
        locGroup.setAttribute('pointer-events', 'none');

        // Mage location-pin icon (24×24 viewbox) scaled to ~12px
        const pinWrap = el('g') as SVGGElement;
        pinWrap.setAttribute('transform', 'translate(-44, 64) scale(0.62)');
        const pinPath = el('path');
        pinPath.setAttribute('fill', '#EF4444');
        pinPath.setAttribute('d', LOCATION_ICON_PATH);
        pinWrap.appendChild(pinPath);

        const locText = el('text') as SVGTextElement;
        locText.setAttribute('font-family', 'Inter, system-ui, sans-serif');
        locText.setAttribute('font-size', '18');
        locText.setAttribute('font-weight', '600');
        locText.setAttribute('fill', '#6D6D6D');
        locText.setAttribute('text-anchor', 'start');
        locText.setAttribute('dominant-baseline', 'middle');
        locText.setAttribute('x', '-26');
        locText.setAttribute('y', '72');
        locText.setAttribute('pointer-events', 'none');
        locText.textContent = d.sublabel ?? '';

        locGroup.append(pinWrap, locText);
        g.append(circ, name, locGroup);

        g.addEventListener('mouseenter', () => {
          circ.setAttribute('stroke', '#E73AA4');
        });
        g.addEventListener('mouseleave', () => {
          circ.setAttribute('stroke', '#000000');
        });

      } else {
        g.style.cursor = 'pointer';

        const box = el('rect');
        box.setAttribute('x', '-24');
        box.setAttribute('y', '-24');
        box.setAttribute('width',  '48');
        box.setAttribute('height', '48');
        box.setAttribute('fill',   '#ffffff');
        box.setAttribute('stroke', '#000000');
        box.setAttribute('stroke-width', '1');

        const title = txt(d.label, { size: 16, weight: 400, fill: '#000000', dy: 44 });

        const desc = txt(d.desc ?? 'Description', { size: 16, weight: 500, fill: '#6D6D6D', dy: 64 });
        desc.style.opacity    = '0';
        desc.style.transition = 'opacity 0.2s ease';

        g.append(box, title, desc);

        g.style.transition = 'opacity 0.25s ease';

        g.addEventListener('mouseenter', () => {
          box.setAttribute('stroke', '#E73AA4');
          desc.style.opacity = '1';

          // Dim all other branch nodes
          simNodes.forEach(other => {
            if (other.type !== 'branch' || other.id === d.id) return;
            const og = nodeElMap[other.id];
            if (og) og.style.opacity = '0.1';
          });
          // Dim links that don't belong to this node
          LINKS.forEach((link, i) => {
            if (link.target !== d.id) linkEls[i].style.opacity = '0.08';
          });
        });

        g.addEventListener('mouseleave', () => {
          box.setAttribute('stroke', '#000000');
          desc.style.opacity = '0';

          // Restore all branch nodes
          simNodes.forEach(other => {
            if (other.type !== 'branch') return;
            const og = nodeElMap[other.id];
            if (og) og.style.opacity = '1';
          });
          // Restore all links
          linkEls.forEach(line => { line.style.opacity = '0.85'; });
        });

        // ── Click → open card ──────────────────────────────────────────────
        g.addEventListener('click', () => {
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
          const cardLeft = wb.left + (wb.width  - CARD_W) / 2;
          const cardTop  = wb.top  + (wb.height - CARD_H) / 2;

          const origin = { x: screen.x - cardLeft, y: screen.y - cardTop };

          if (d.id === 'project' || d.id === 'about') {
            // Dispatch unified open-page event so NavMenu & page system both update
            window.dispatchEvent(new CustomEvent('open-page', { detail: { page: d.id, origin } }));
          } else {
            setNodeOrigin(origin);
            setActiveNode(d);
          }
        });
      }

      nodeG.appendChild(g);
    });

    // ── Drag (center) ─────────────────────────────────────────────────────────
    const centerG    = nodeElMap['center'];
    const centerNode = simNodes.find(n => n.id === 'center')!;

    function svgPoint(e: MouseEvent | TouchEvent) {
      const pt  = (svg as any).createSVGPoint() as SVGPoint;
      const src = 'touches' in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
      pt.x = src.clientX; pt.y = src.clientY;
      return pt.matrixTransform((svg as any).getScreenCTM()!.inverse());
    }

    let dragging = false;

    centerG.addEventListener('mousedown', e => {
      e.preventDefault(); dragging = true;
      centerG.style.cursor = 'grabbing';
      simulation.alphaTarget(0.4).restart();
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup',   onUp);
    });

    centerG.addEventListener('touchstart', () => {
      dragging = true;
      simulation.alphaTarget(0.4).restart();
      window.addEventListener('touchmove', onMove as any, { passive: false });
      window.addEventListener('touchend',  onUp);
    }, { passive: true });

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
      centerG.style.cursor = 'grab';
      centerNode.fx = null; centerNode.fy = null;

      // Burst of energy on release → then smoothly return to orbital cruise
      (simulation.force('link') as any).strength(0.18);
      simulation.velocityDecay(0.22).alphaTarget(0.40).restart();
      setTimeout(() => { simulation.velocityDecay(0.30).alphaTarget(0.20); }, 400);
      setTimeout(() => {
        (simulation.force('link') as any).strength(0.06);
        simulation.velocityDecay(0.38).alphaTarget(0.08);
      }, 900);

      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend',  onUp);
    }

    // ── Tick ─────────────────────────────────────────────────────────────────
    simulation.on('tick', () => {
      simNodes.forEach(d => {
        const r = d.type === 'center' ? 50 : 70;
        d.x = Math.max(r, Math.min(W - r, d.x ?? W / 2));
        d.y = Math.max(r, Math.min(H - r, d.y ?? H / 2));
      });
      (simLinks as any[]).forEach((link, i) => {
        const s = link.source as SimNode, t = link.target as SimNode;
        linkEls[i].setAttribute('x1', String(s.x)); linkEls[i].setAttribute('y1', String(s.y));
        linkEls[i].setAttribute('x2', String(t.x)); linkEls[i].setAttribute('y2', String(t.y));
      });
      simNodes.forEach(d => {
        const g = nodeElMap[d.id];
        if (g) g.setAttribute('transform', `translate(${d.x},${d.y})`);
      });
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      W = wrap!.clientWidth; H = wrap!.clientHeight;
      setViewBox();
      simulation.alpha(0.3).restart();
    });
    ro.observe(wrap);

    return () => {
      simulation.stop();
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative select-none"
      aria-label="Interactive node graph"
    >
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 tracking-widest uppercase pointer-events-none z-10">
        drag the center node
      </p>
      <svg ref={svgRef} className="w-full h-full block" aria-label="Force graph" />

      {/* ── Closing page animates out (mac-close) ── */}
      {closingPage && createPortal(
        closingPage === 'project' ? <ProjectPage      onClose={() => {}} origin={null} isClosing={true} /> :
        closingPage === 'about'   ? <AboutPage         onClose={() => {}} origin={null} isClosing={true} /> :
                                    <VisitorGalleryPage onClose={() => {}}              isClosing={true} />,
        document.getElementById('canvas-overlay')!,
        `closing-${closingPage}`
      )}

      {/* ── Active page animates in (mac-open) ── */}
      {activePage && activePage !== closingPage && createPortal(
        activePage === 'project' ? <ProjectPage      onClose={closeCurrentPage} origin={pageOrigin} isClosing={false} /> :
        activePage === 'about'   ? <AboutPage         onClose={closeCurrentPage} origin={pageOrigin} isClosing={false} /> :
                                   <VisitorGalleryPage onClose={closeCurrentPage}                    isClosing={false} />,
        document.getElementById('canvas-overlay')!,
        `active-${activePage}`
      )}

      {/* ── Node card modal (non-page nodes) ── */}
      {activeNode && createPortal(
        <NodeCard node={activeNode} onClose={() => setActiveNode(null)} origin={nodeOrigin} forceClose={isNodeClosing} />,
        document.getElementById('canvas-overlay')!
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
        dot!.style.top  = `${e.clientY}px`;
      });
    }

    function onProjectCursor(e: Event) {
      const active = (e as CustomEvent<{ active: boolean }>).detail.active;
      setHovering(active);
    }

    window.addEventListener('mousemove', move);
    window.addEventListener('project-cursor', onProjectCursor);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('project-cursor', onProjectCursor);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[9999]"
      style={{ transform: 'translate(-50%,-50%)', left: '-20px', top: '-20px' }}
      aria-hidden="true"
    >
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{
          background: '#E73AA4',
          borderRadius: '9999px',
          mixBlendMode: hovering ? 'normal' : 'multiply',
          width:  hovering ? '196px' : '16px',
          height: hovering ? '48px'  : '16px',
        }}
      >
        <span
          className="text-white select-none whitespace-nowrap transition-opacity duration-150"
          style={{
            opacity: hovering ? 1 : 0,
            transitionDelay: hovering ? '80ms' : '0ms',
            fontFamily: "'Inconsolata', 'Courier New', monospace",
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          View case study ↗
        </span>
      </div>
    </div>
  );
}
