import { useEffect, useRef, useState } from 'react';
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
  { id: 'center',  label: 'Fitri Zahwa', sublabel: 'Indonesia', type: 'center' },
  { id: 'work',    label: 'Title',       desc: 'Description',   type: 'branch' },
  { id: 'read',    label: 'Title',       desc: 'Description',   type: 'branch' },
  { id: 'design',  label: 'Title',       desc: 'Description',   type: 'branch' },
  { id: 'contact', label: 'Title',       desc: 'Description',   type: 'branch' },
  { id: 'about',   label: 'Title',       desc: 'Description',   type: 'branch' },
];

const LINKS: { source: string; target: string }[] = [
  { source: 'center', target: 'work'    },
  { source: 'center', target: 'read'    },
  { source: 'center', target: 'design'  },
  { source: 'center', target: 'contact' },
  { source: 'center', target: 'about'   },
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

// ─── Node Card Overlay ───────────────────────────────────────────────────────
function NodeCard({ node: _node, onClose }: { node: NodeDef; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-20 ${closing ? 'backdrop-out' : 'backdrop-in'}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      {/* Card */}
      <div
        className={`relative bg-white border border-gray-200 rounded-2xl shadow-xl w-[420px] max-w-[90%] overflow-hidden ${closing ? 'mac-close' : 'mac-open'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Window chrome */}
        <div className="group/chrome flex items-center gap-1.5 px-4 pt-4 pb-3 border-b border-gray-100">
          <button
            onClick={handleClose}
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
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          <span className="ml-2 text-sm font-medium text-gray-800 select-none">Title</span>
          <span className="ml-2 text-sm text-gray-400 select-none">Description</span>
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
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ForceGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<NodeDef | null>(null);

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
      .force('link',    forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(180).strength(0.08))
      .force('charge',  forceManyBody().strength(-320))
      .force('collide', forceCollide<SimNode>().radius(72).strength(0.9))
      .alphaDecay(0.015)
      .velocityDecay(0.65)
      .alphaTarget(0)
      .alphaMin(0.001);

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

        const name = txt(d.label, { size: 16, weight: 500, fill: '#000000', dy: 48 });

        // Location row: mage location-pin icon + country text
        const locGroup = el('g') as SVGGElement;
        locGroup.setAttribute('pointer-events', 'none');

        // Mage location-pin icon (24×24 viewbox) scaled to ~12px
        const pinWrap = el('g') as SVGGElement;
        pinWrap.setAttribute('transform', 'translate(-38, 57) scale(0.5)');
        const pinPath = el('path');
        pinPath.setAttribute('fill', 'none');
        pinPath.setAttribute('stroke', '#6D6D6D');
        pinPath.setAttribute('stroke-linecap', 'round');
        pinPath.setAttribute('stroke-linejoin', 'round');
        pinPath.setAttribute('stroke-width', '1.5');
        pinPath.setAttribute('d', 'M12 13.632A5.441 5.441 0 1 0 12 2.75a5.441 5.441 0 0 0 0 10.882m0 0v7.618');
        pinWrap.appendChild(pinPath);

        const locText = el('text') as SVGTextElement;
        locText.setAttribute('font-family', 'Inter, system-ui, sans-serif');
        locText.setAttribute('font-size', '16');
        locText.setAttribute('font-weight', '500');
        locText.setAttribute('fill', '#6D6D6D');
        locText.setAttribute('text-anchor', 'start');
        locText.setAttribute('dominant-baseline', 'middle');
        locText.setAttribute('x', '-26');
        locText.setAttribute('y', '64');
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

        g.addEventListener('mouseenter', () => {
          box.setAttribute('stroke', '#E73AA4');
          desc.style.opacity = '1';
        });
        g.addEventListener('mouseleave', () => {
          box.setAttribute('stroke', '#000000');
          desc.style.opacity = '0';
        });

        // ── Click → open card ──────────────────────────────────────────────
        g.addEventListener('click', () => {
          setActiveNode(d);
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

      (simulation.force('link') as any).strength(0.18);
      simulation.velocityDecay(0.28).alphaTarget(0.35).restart();
      setTimeout(() => { simulation.velocityDecay(0.50).alphaTarget(0.15); }, 450);
      setTimeout(() => {
        (simulation.force('link') as any).strength(0.08);
        simulation.velocityDecay(0.70).alphaTarget(0);
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
      {activeNode && (
        <NodeCard node={activeNode} onClose={() => setActiveNode(null)} />
      )}
      <CursorDot />
    </div>
  );
}

// ── Cursor Dot ────────────────────────────────────────────────────────────────
function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

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

    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999]"
      style={{ background: '#E73AA4', transform: 'translate(-50%,-50%)', mixBlendMode: 'multiply', left: '-20px', top: '-20px' }}
      aria-hidden="true"
    />
  );
}
