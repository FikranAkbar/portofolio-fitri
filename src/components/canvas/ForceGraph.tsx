import { useEffect, useRef, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
} from 'd3-force';

// ─── Types ──────────────────────────────────────────────────────────────────
type NodeDef = { id: string; label: string; sublabel?: string; type: 'center' | 'box' | 'pill' };
type SimNode = NodeDef & {
  x: number; y: number;
  vx: number; vy: number;
  fx: number | null; fy: number | null;
};
type SimLink = { source: string | SimNode; target: string | SimNode };

// ─── Constants ───────────────────────────────────────────────────────────────
const NODES: NodeDef[] = [
  { id: 'center',     label: 'Fitri Zahwa', sublabel: 'Indonesia', type: 'center' },
  { id: 'work',       label: 'Work',        sublabel: 'Go to work', type: 'box'   },
  { id: 'read',       label: 'Read',        type: 'pill'  },
  { id: 'design',     label: 'Design',      type: 'pill'  },
  { id: 'contact',    label: 'Contact',     type: 'pill'  },
];

const LINKS: { source: string; target: string }[] = [
  { source: 'center', target: 'work'    },
  { source: 'center', target: 'read'    },
  { source: 'center', target: 'design'  },
  { source: 'center', target: 'contact' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ns = 'http://www.w3.org/2000/svg';
const el = (tag: string) => document.createElementNS(ns, tag);

// ─── Component ───────────────────────────────────────────────────────────────
export default function ForceGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg  = svgRef.current;
    if (!wrap || !svg) return;

    // Clear any previous render
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    let W = wrap.clientWidth  || 900;
    let H = wrap.clientHeight || 600;

    function setViewBox() {
      svg!.setAttribute('viewBox', `0 0 ${W} ${H}`);
    }
    setViewBox();

    // ── Simulation nodes ─────────────────────────────────────────────────────
    const simNodes: SimNode[] = NODES.map((n, i) => ({
      ...n,
      x: W / 2 + (i === 0 ? 0 : (Math.random() - 0.5) * 300),
      y: H / 2 + (i === 0 ? 60 : (Math.random() - 0.5) * 220),
      vx: 0, vy: 0, fx: null, fy: null,
    }));

    const simLinks: SimLink[] = LINKS.map(l => ({ ...l }));

    // ── Simulation ───────────────────────────────────────────────────────────
    const simulation = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id(d => d.id)
          .distance(d => ((d.target as SimNode).type === 'box' ? 190 : 200))
          .strength(0.08),
      )
      .force('charge',  forceManyBody().strength(-280))
      .force('collide', forceCollide<SimNode>().radius(d => d.type === 'center' ? 64 : 56).strength(0.9))
      .alphaDecay(0.015)
      .velocityDecay(0.65)
      .alphaTarget(0)
      .alphaMin(0.001);

    // ── Defs ─────────────────────────────────────────────────────────────────
    const defs = el('defs');

    // Radial gradient for center node
    const grad = el('radialGradient') as SVGRadialGradientElement;
    grad.id = 'center-grad';
    ['cx','cy','r'].forEach(a => grad.setAttribute(a,'50%'));
    const gs1 = el('stop'); gs1.setAttribute('offset','0%');   gs1.setAttribute('stop-color','#ffffff');
    const gs2 = el('stop'); gs2.setAttribute('offset','100%'); gs2.setAttribute('stop-color','#e2e8f0');
    grad.append(gs1, gs2);

    // Glow filter
    const filt = el('filter'); filt.id = 'glow';
    filt.setAttribute('x','-60%'); filt.setAttribute('y','-60%');
    filt.setAttribute('width','220%'); filt.setAttribute('height','220%');
    const blur = el('feGaussianBlur'); blur.setAttribute('stdDeviation','8'); blur.setAttribute('result','cb');
    const merge = el('feMerge');
    const mn1 = el('feMergeNode'); mn1.setAttribute('in','cb');
    const mn2 = el('feMergeNode'); mn2.setAttribute('in','SourceGraphic');
    merge.append(mn1, mn2); filt.append(blur, merge);

    // Pink glow filter
    const pinkFilt = el('filter'); pinkFilt.id = 'pink-glow';
    pinkFilt.setAttribute('x','-80%'); pinkFilt.setAttribute('y','-80%');
    pinkFilt.setAttribute('width','260%'); pinkFilt.setAttribute('height','260%');
    const pinkBlur = el('feGaussianBlur'); pinkBlur.setAttribute('stdDeviation','10'); pinkBlur.setAttribute('result','pb');
    const pinkFlood = el('feFlood'); pinkFlood.setAttribute('flood-color','#FF49DB'); pinkFlood.setAttribute('flood-opacity','0.35'); pinkFlood.setAttribute('result','pc');
    const pinkComp = el('feComposite'); pinkComp.setAttribute('in','pc'); pinkComp.setAttribute('in2','pb'); pinkComp.setAttribute('operator','in'); pinkComp.setAttribute('result','pg');
    const pinkMerge = el('feMerge');
    const pm1 = el('feMergeNode'); pm1.setAttribute('in','pg');
    const pm2 = el('feMergeNode'); pm2.setAttribute('in','SourceGraphic');
    pinkMerge.append(pm1, pm2); pinkFilt.append(pinkBlur, pinkFlood, pinkComp, pinkMerge);

    defs.append(grad, filt, pinkFilt);
    svg.appendChild(defs);

    // ── Link group ───────────────────────────────────────────────────────────
    const linkG = el('g'); svg.appendChild(linkG);
    const nodeG = el('g'); svg.appendChild(nodeG);

    // Link elements
    const linkEls = simLinks.map((lk) => {
      const line = el('line');
      const tgt = NODES.find(n => n.id === (lk.target as string));
      line.setAttribute('stroke', '#d1d5db');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', tgt?.type === 'box' ? '6 4' : '4 4');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0.7');
      linkG.appendChild(line);
      return line;
    });

    // ── Node elements ────────────────────────────────────────────────────────
    const nodeElMap: Record<string, SVGGElement> = {};

    simNodes.forEach(d => {
      const g = el('g') as SVGGElement;
      nodeElMap[d.id] = g;

      if (d.type === 'center') {
        // ── Center circle ──
        g.style.cursor = 'grab';

        // Pulse ring (animated via CSS class)
        const ring = el('circle');
        ring.setAttribute('r','48'); ring.setAttribute('fill','none');
        ring.setAttribute('stroke','#CBD5E1'); ring.setAttribute('stroke-width','1.5');
        ring.setAttribute('opacity','0.3');
        ring.classList.add('pulse-ring');

        // Main circle
        const circ = el('circle');
        circ.setAttribute('r','40'); circ.setAttribute('fill','url(#center-grad)');
        circ.setAttribute('stroke','#e2e8f0'); circ.setAttribute('stroke-width','1.5');

        // Name text
        const txt = el('text');
        txt.setAttribute('text-anchor','middle'); txt.setAttribute('dominant-baseline','middle');
        txt.setAttribute('fill','#111827'); txt.setAttribute('font-size','13');
        txt.setAttribute('font-weight','600'); txt.setAttribute('font-family','Inter,system-ui,sans-serif');
        txt.setAttribute('pointer-events','none');
        txt.setAttribute('dy','-6');
        txt.textContent = d.label;

        // Location sub-label
        const subGroup = el('g');
        subGroup.setAttribute('pointer-events','none');

        const pinIcon = el('text');
        pinIcon.setAttribute('text-anchor','middle');
        pinIcon.setAttribute('dominant-baseline','middle');
        pinIcon.setAttribute('font-size','9');
        pinIcon.setAttribute('dy','9');
        pinIcon.setAttribute('dx','-14');
        pinIcon.setAttribute('fill','#9ca3af');
        pinIcon.textContent = '📍';

        const subTxt = el('text');
        subTxt.setAttribute('text-anchor','middle'); subTxt.setAttribute('dominant-baseline','middle');
        subTxt.setAttribute('fill','#9ca3af'); subTxt.setAttribute('font-size','10');
        subTxt.setAttribute('font-weight','400'); subTxt.setAttribute('font-family','Inter,system-ui,sans-serif');
        subTxt.setAttribute('dy','9');
        subTxt.setAttribute('dx','8');
        subTxt.textContent = d.sublabel ?? '';

        subGroup.append(pinIcon, subTxt);
        g.append(ring, circ, txt, subGroup);

        // Hover
        g.addEventListener('mouseenter', () => {
          circ.setAttribute('filter','url(#glow)');
          circ.setAttribute('stroke','#FF49DB');
          circ.setAttribute('stroke-width','1.5');
        });
        g.addEventListener('mouseleave', () => {
          circ.removeAttribute('filter');
          circ.setAttribute('stroke','#e2e8f0');
          circ.setAttribute('stroke-width','1.5');
        });

      } else if (d.type === 'box') {
        // ── Box node (Work) ──
        g.style.cursor = 'pointer';

        const rect = el('rect');
        rect.setAttribute('rx','8'); rect.setAttribute('ry','8');
        rect.setAttribute('width','80'); rect.setAttribute('height','44');
        rect.setAttribute('x','-40'); rect.setAttribute('y','-22');
        rect.setAttribute('fill','#ffffff');
        rect.setAttribute('stroke','#e5e7eb'); rect.setAttribute('stroke-width','1');

        const txt = el('text');
        txt.setAttribute('text-anchor','middle'); txt.setAttribute('dominant-baseline','middle');
        txt.setAttribute('fill','#111827'); txt.setAttribute('font-size','12');
        txt.setAttribute('font-weight','600'); txt.setAttribute('font-family','Inter,system-ui,sans-serif');
        txt.setAttribute('pointer-events','none');
        txt.setAttribute('dy','-5');
        txt.textContent = d.label;

        const subTxt = el('text');
        subTxt.setAttribute('text-anchor','middle'); subTxt.setAttribute('dominant-baseline','middle');
        subTxt.setAttribute('fill','#9ca3af'); subTxt.setAttribute('font-size','9.5');
        subTxt.setAttribute('font-weight','400'); subTxt.setAttribute('font-family','Inter,system-ui,sans-serif');
        subTxt.setAttribute('pointer-events','none');
        subTxt.setAttribute('dy','7');
        subTxt.textContent = d.sublabel ?? '';

        g.append(rect, txt, subTxt);

        // Hover
        g.addEventListener('mouseenter', () => {
          rect.setAttribute('stroke','#FF49DB');
          rect.setAttribute('filter','url(#pink-glow)');
          txt.setAttribute('fill','#FF49DB');
        });
        g.addEventListener('mouseleave', () => {
          rect.setAttribute('stroke','#e5e7eb');
          rect.removeAttribute('filter');
          txt.setAttribute('fill','#111827');
        });

      } else {
        // ── Pill node (Read, Design, Contact) ──
        g.style.cursor = 'pointer';

        const rect = el('rect');
        rect.setAttribute('rx','20'); rect.setAttribute('ry','20');
        rect.setAttribute('fill','#f9fafb');
        rect.setAttribute('stroke','#e5e7eb'); rect.setAttribute('stroke-width','1');

        const txt = el('text');
        txt.setAttribute('text-anchor','middle'); txt.setAttribute('dominant-baseline','middle');
        txt.setAttribute('fill','#374151'); txt.setAttribute('font-size','12');
        txt.setAttribute('font-weight','500'); txt.setAttribute('font-family','Inter,system-ui,sans-serif');
        txt.setAttribute('pointer-events','none');
        txt.textContent = d.label;

        g.append(rect, txt);

        requestAnimationFrame(() => {
          try {
            const b = txt.getBBox();
            const px = 16, py = 9;
            rect.setAttribute('width',  String(b.width  + px * 2));
            rect.setAttribute('height', String(b.height + py * 2));
            rect.setAttribute('x', String(-(b.width  / 2 + px)));
            rect.setAttribute('y', String(-(b.height / 2 + py)));
          } catch(_) {}
        });

        // Hover
        g.addEventListener('mouseenter', () => {
          rect.setAttribute('fill','#fff0fa');
          rect.setAttribute('stroke','#FF49DB');
          txt.setAttribute('fill','#FF49DB');
        });
        g.addEventListener('mouseleave', () => {
          rect.setAttribute('fill','#f9fafb');
          rect.setAttribute('stroke','#e5e7eb');
          txt.setAttribute('fill','#374151');
        });
      }

      nodeG.appendChild(g);
    });

    // ── Drag (center node) ───────────────────────────────────────────────────
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
      window.addEventListener('mouseup', onUp);
    });

    centerG.addEventListener('touchstart', () => {
      dragging = true;
      simulation.alphaTarget(0.4).restart();
      window.addEventListener('touchmove', onMove as any, { passive: false });
      window.addEventListener('touchend', onUp);
    }, { passive: true });

    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      (e as Event).preventDefault();
      const p = svgPoint(e as MouseEvent);
      // Clamp drag position so center node stays inside canvas
      const margin = 50;
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
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp);
    }

    // ── Tick ─────────────────────────────────────────────────────────────────
    simulation.on('tick', () => {
      // Clamp every node so it can't leave the canvas
      simNodes.forEach(d => {
        const r = d.type === 'center' ? 52 : 56;
        d.x = Math.max(r, Math.min(W - r, d.x ?? W / 2));
        d.y = Math.max(r, Math.min(H - r, d.y ?? H / 2));
      });

      (simLinks as any[]).forEach((link, i) => {
        const s = link.source as SimNode, t = link.target as SimNode;
        linkEls[i].setAttribute('x1', String(s.x ?? 0));
        linkEls[i].setAttribute('y1', String(s.y ?? 0));
        linkEls[i].setAttribute('x2', String(t.x ?? 0));
        linkEls[i].setAttribute('y2', String(t.y ?? 0));
      });
      simNodes.forEach(d => {
        const g = nodeElMap[d.id];
        if (g) g.setAttribute('transform', `translate(${d.x ?? 0},${d.y ?? 0})`);
      });
    });

    // ── Resize Observer ───────────────────────────────────────────────────────
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
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative select-none"
      aria-label="Interactive node graph"
    >
      {/* Drag hint */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 tracking-widest uppercase pointer-events-none z-10">
        drag the center node
      </p>

      <svg
        ref={svgRef}
        className="w-full h-full block"
        aria-label="Force graph"
      />

      {/* Pink cursor dot — purely decorative */}
      <CursorDot />
    </div>
  );
}

// ── Cursor Dot ───────────────────────────────────────────────────────────────
function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    let raf = 0;
    let cx = -20, cy = -20;

    function move(e: MouseEvent) {
      cx = e.clientX; cy = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot!.style.left = `${cx}px`;
        dot!.style.top  = `${cy}px`;
      });
    }

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999]"
      style={{
        background: '#FF49DB',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'multiply',
        left: '-20px',
        top: '-20px',
      }}
      aria-hidden="true"
    />
  );
}

