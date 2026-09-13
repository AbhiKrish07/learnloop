import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  Folder,
  GitBranch,
  Layers3,
  Menu,
  Moon,
  MessageCircle,
  MoreHorizontal,
  MousePointer2,
  NotebookPen,
  PanelRight,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Target,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const conceptNodes = [
  { label: "Functions", x: "12%", y: "36%", state: "done" },
  { label: "Derivatives", x: "39%", y: "17%", state: "done" },
  { label: "Composition", x: "62%", y: "41%", state: "gap" },
  { label: "Chain rule", x: "36%", y: "72%", state: "next" },
  { label: "Backprop", x: "78%", y: "74%", state: "locked" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <div className="app-brand"><span className="app-brand-mark"><span /></span><strong>learnloop</strong></div>
      <div className="workspace-label">MY WORKSPACE <Plus size={12} /></div>
      <div className="workspace-row active"><BookOpen size={15} /><span>Calculus / Foundations</span><MoreHorizontal size={14} /></div>
      <div className="workspace-row"><Folder size={15} /><span>Computer science</span></div>
      <div className="workspace-row"><Folder size={15} /><span>Loose notes</span></div>
      <div className="workspace-divider" />
      <div className="workspace-label">RECENT</div>
      <div className="recent-note"><span className="recent-dot blue" /><span>Chain rule — session 08</span></div>
      <div className="recent-note"><span className="recent-dot yellow" /><span>Computational graphs</span></div>
      <div className="recent-note"><span className="recent-dot pink" /><span>Derivative shortcuts</span></div>
      <div className="sidebar-bottom"><div className="avatar">AS</div><span>Alex's workspace</span><ChevronDown size={14} /></div>
    </aside>
  );
}

type LearningStage = "observe" | "surface" | "adapt";
type InkStroke = { points: Array<{ x: number; y: number }>; width: number };

function NotesPage({ compact = false, penMode, inkStrokes, noteTitle, noteBody, onTitleChange, onBodyChange, onPenDown, onPenMove, onPenUp, onTogglePen }: { compact?: boolean; penMode: boolean; inkStrokes: InkStroke[]; noteTitle: string; noteBody: string; onTitleChange: (value: string) => void; onBodyChange: (value: string) => void; onPenDown: (event: React.PointerEvent<HTMLDivElement>) => void; onPenMove: (event: React.PointerEvent<HTMLDivElement>) => void; onPenUp: (event: React.PointerEvent<HTMLDivElement>) => void; onTogglePen: () => void }) {
  return (
    <div className={`notes-page ${compact ? "notes-page-compact" : ""}`}>
      <div className="notes-toolbar"><span className="note-breadcrumb">Calculus <ChevronRight size={12} /> Chain rule — session 08</span><span className="toolbar-actions"><button className={`pen-toggle ${penMode ? "active" : ""}`} aria-label="Toggle pen mode" onClick={onTogglePen}><PenLine size={13} /></button><Search size={14} /><MoreHorizontal size={15} /></span></div>
      <div className={`note-canvas ${penMode ? "pen-active" : ""}`} onPointerDown={onPenDown} onPointerMove={onPenMove} onPointerUp={onPenUp} onPointerCancel={onPenUp}>
        <svg className="ink-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{inkStrokes.map((stroke, index) => <polyline key={index} points={stroke.points.map((point) => `${point.x},${point.y}`).join(" ")} style={{ strokeWidth: stroke.width }} />)}</svg>
        <div className="note-title"><span className="title-icon"><FileText size={16} /></span><h3 contentEditable suppressContentEditableWarning onInput={(event) => onTitleChange(event.currentTarget.textContent || "")}>{noteTitle}</h3></div>
        <p className="note-date">Monday, October 14 · 9:41 PM</p>
        <div className="note-rule" />
        <div className="ink-heading">When one thing changes <em>inside</em> another</div>
        <p className="ink-copy" contentEditable suppressContentEditableWarning onInput={(event) => onBodyChange(event.currentTarget.textContent || "")}>{noteBody}</p>
        <div className="equation-card"><span>dy/dx</span><b>=</b><span className="fraction"><i>dy</i><small>du</small></span><b>·</b><span className="fraction"><i>du</i><small>dx</small></span></div>
        <div className="handwritten-callout"><span className="underline-blue">outer change</span> × <span className="underline-yellow">inner change</span></div>
        <div className="worked-example"><span className="example-label">TRY IT</span><p>f(x) = sin(3x² + 1)</p><div className="answer-line">f′(x) = cos(3x² + 1) · <span>6x</span></div><div className="check-stamp"><Check size={13} /> correct</div></div>
        <div className="margin-note"><span>the inside changes first</span><svg viewBox="0 0 100 38"><path d="M3 3 C35 5,45 37,97 20" /></svg></div>
      </div>
    </div>
  );
}

function CoachPanel({ stage }: { stage: LearningStage }) {
  const content = {
    observe: { label: "WATCHING YOUR WORK", title: "One thing to notice", lead: <>You got the answer. <em>Keep showing the hidden step.</em></>, support: "LearnLoop is reading the way you work — not just the final line. Keep going and the useful pattern will surface." },
    surface: { label: "PATTERN SURFACED", title: "One thing to notice", lead: <>You got the answer. <em>Now make the hidden step visible.</em></>, support: "I noticed this same shortcut in your derivative notes three weeks ago. Your final answers are right, but the inner function keeps disappearing from the working." },
    adapt: { label: "NEXT MOVE READY", title: "Worth your next 2 min", lead: <>Make the next attempt <em>smaller and clearer.</em></>, support: "Try one focused prompt that separates the inside change from the outside change. That is the evidence still missing from your model." },
  }[stage];
  return (
    <aside className="coach-panel-app">
      <div className="coach-panel-header"><div><span className="coach-live"><i /> {content.label}</span><strong>{content.title}</strong></div><PanelRight size={15} /></div>
      <div className="coach-panel-body">
        <div className="coach-signal-icon"><Sparkles size={15} /></div>
        <p className="coach-lead">{content.lead}</p>
        <p className="coach-support">{content.support}</p>
        <div className="coach-evidence"><div className="evidence-header"><span>RECURRING PATTERN</span><span>3 sessions</span></div><div className="evidence-bars"><span /><span /><span /><span className="muted" /></div><small>chain rule / composition</small></div>
        <button className="coach-next">{stage === "adapt" ? "Start the focused prompt" : "Open a 2 min prompt"} <ArrowUpRight size={14} /></button>
      </div>
      <div className="coach-panel-footer"><span><Zap size={12} /> observing your work</span><span>62%</span></div>
    </aside>
  );
}

function IpadProduct({ scrollY, compact = false }: { scrollY: number; compact?: boolean }) {
  const rotation = compact ? 0 : Math.min(8, scrollY * 0.008);
  const lift = compact ? 0 : Math.min(44, scrollY * 0.055);
  const stage: LearningStage = scrollY < 420 ? "observe" : scrollY < 1050 ? "surface" : "adapt";
  const [penMode, setPenMode] = useState(false);
  const [inkStrokes, setInkStrokes] = useState<InkStroke[]>(() => { try { return JSON.parse(localStorage.getItem("learnloop-ink-strokes") || "[]") as InkStroke[]; } catch { return []; } });
  const [noteTitle, setNoteTitle] = useState(() => localStorage.getItem("learnloop-note-title") || "Chain rule — session 08");
  const [noteBody, setNoteBody] = useState(() => localStorage.getItem("learnloop-note-body") || "If y = f(g(x)), then y changes in two steps:");
  useEffect(() => { localStorage.setItem("learnloop-ink-strokes", JSON.stringify(inkStrokes)); }, [inkStrokes]);
  useEffect(() => { localStorage.setItem("learnloop-note-title", noteTitle); }, [noteTitle]);
  useEffect(() => { localStorage.setItem("learnloop-note-body", noteBody); }, [noteBody]);
  const penPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!penMode) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const pressure = event.pressure > 0 ? event.pressure : 0.5;
    return { point: { x, y }, width: 0.55 + pressure * 1.35 };
  };
  const startPenStroke = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!penMode) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = penPoint(event);
    if (point) setInkStrokes((strokes) => [...strokes.slice(-11), { points: [point.point], width: point.width }]);
  };
  const continuePenStroke = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!penMode || !event.buttons) return;
    const point = penPoint(event);
    if (point) setInkStrokes((strokes) => strokes.length ? [...strokes.slice(0, -1), { ...strokes[strokes.length - 1], points: [...strokes[strokes.length - 1].points, point.point], width: Math.max(strokes[strokes.length - 1].width, point.width) }] : strokes);
  };
  const endPenStroke = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div className={`ipad-stage ${compact ? "ipad-stage-compact" : ""} stage-${stage}`} data-learning-stage={stage} style={{ transform: `translateY(${-lift}px) rotateX(${compact ? 0 : 5 + rotation * 0.14}deg) rotateY(${compact ? 0 : -rotation * 0.16}deg) rotateZ(${compact ? 0 : -2 + rotation * 0.06}deg)` }}>
      <div className="ipad-shadow" />
      <div className="ipad-device">
        <div className="ipad-camera" />
        <div className="ipad-screen">
          <div className="ipad-status"><span>9:41</span><span>••• ᯤ ▰</span></div>
          <div className="notes-app-shell"><AppSidebar /><main className="notes-main"><div className="notes-topbar"><span className="notes-top-title">LearnLoop <span>/</span> Calculus</span><div className="notes-top-actions"><span className="stage-chip"><i /> {stage}</span><Search size={15} /><span className="share-button">Share</span><div className="mini-avatar">AS</div></div></div><div className="notes-content"><NotesPage noteTitle={noteTitle} noteBody={noteBody} onTitleChange={setNoteTitle} onBodyChange={setNoteBody} penMode={penMode} inkStrokes={inkStrokes} onPenDown={startPenStroke} onPenMove={continuePenStroke} onPenUp={endPenStroke} onTogglePen={() => setPenMode((value) => !value)} /><CoachPanel stage={stage} /></div></main></div>
        </div>
      </div>
      <div className="ipad-glow" />
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("learnloop-theme") as "light" | "dark") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("diagnose");
  const [emailSent, setEmailSent] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const finalSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("theme-transition");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("learnloop-theme", theme);
    const timer = window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 280);
    return () => window.clearTimeout(timer);
  }, [theme]);

  useEffect(() => {
    const section = finalSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setFinalVisible(entry.isIntersecting), { threshold: 0.16 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const progress = useMemo(() => Math.min(1, scrollY / 1050), [scrollY]);

  return (
    <div className="learnloop-site">
      <header className="site-nav">
        <a className="site-logo" href="#top"><span className="logo-symbol"><span /></span><strong>learnloop</strong></a>
        <nav className={menuOpen ? "nav-open" : ""}><a href="#product" onClick={() => setMenuOpen(false)}>Product</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#why" onClick={() => setMenuOpen(false)}>Why LearnLoop</a></nav>
        <div className="nav-right"><button className="theme-toggle" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={14} /> : <Sun size={14} />}</button><button className="login-button" onClick={() => setDemoOpen(true)}>Request access <ArrowUpRight size={14} /></button><button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
      </header>

      <main id="top">
        <section id="product" className="product-hero">
          <div className="hero-copy-light"><div className="product-eyebrow"><span className="eyebrow-pill">NEW</span> A notebook-native learning coach</div><h1>Your notes.<br /><span>Your coach.</span></h1><p>LearnLoop lives inside the work — seeing what you write, where you hesitate, and which mistake keeps coming back. It turns those small signals into a clearer next step, without asking you to stop studying and explain yourself to a chatbot.</p><div className="hero-buttons"><button className="primary-button" onClick={() => scrollToId("ipad-demo")}>Explore the workspace <ArrowRight size={16} /></button><button className="quiet-button" onClick={() => scrollToId("why")}><MousePointer2 size={14} /> See how it works</button></div><div className="hero-meta"><span><span className="meta-dot" /> private by default</span><span>built for real studying</span></div></div>
          <div className="hero-product-wrap"><IpadProduct scrollY={scrollY} /><div className="scroll-hint"><ArrowDown size={14} /> scroll to move through the workspace</div></div>
          <div className="hero-index">01 <span /> 04</div>
        </section>

        <section className="proof-strip"><div><strong>Built around your actual work</strong><span>not a secondhand summary of it</span></div><div><NotebookPen size={18} /><span>write normally</span></div><div><BrainCircuit size={18} /><span>get better signals</span></div><div><Target size={18} /><span>know what matters</span></div></section>

        <section id="why" className="why-section page-section"><div className="section-label"><span>01</span><span>THE PRODUCT PRINCIPLE</span></div><div className="why-grid"><div><h2>It is not a chat<br />window <em>with a notebook.</em></h2></div><div className="why-copy"><p className="large-statement">It is a notebook that can <strong>notice.</strong></p><p>Most learning tools ask you to describe what you know. LearnLoop watches you try — the working, the correction, the confident wrong turn — and uses that evidence to choose the next useful move.</p><button className="text-link" onClick={() => setDemoOpen(true)}>Why “resident” matters <ArrowUpRight size={15} /></button></div></div><div className="visitor-resident"><div className="mini-concept visitor"><span className="concept-tag">A VISITOR</span><h3>“What do you need help with?”</h3><div className="empty-chat"><div /><div /><div /></div><p>It only knows what you bring to the conversation.</p></div><div className="versus">vs</div><div className="mini-concept resident"><span className="concept-tag">A RESIDENT</span><h3>“I saw this pattern again.”</h3><div className="signal-line"><span /><span /><span /><b /></div><p>It has direct access to the studying itself.</p></div></div></section>

        <section id="ipad-demo" className="workspace-section page-section"><div className="section-label"><span>02</span><span>THE LEARNLOOP WORKSPACE</span></div><div className="workspace-heading"><h2>A calm place to<br /><em>figure things out.</em></h2><p>Everything you need to study in one view. Your notes stay yours. The coach stays close enough to be useful.</p></div><div className="workspace-showcase"><IpadProduct scrollY={scrollY * 0.25} compact /><div className="workspace-callout callout-one"><span className="callout-number">01</span><strong>Write like you already do.</strong><p>Pen, keyboard, sketches, half-finished thoughts — all fair game.</p></div><div className="workspace-callout callout-two"><span className="callout-number">02</span><strong>The coach reads the context.</strong><p>No copy-pasting your notes into a separate chat box.</p></div></div></section>

        <section id="how-it-works" className="loop-section page-section"><div className="section-label"><span>03</span><span>FROM NOTE TO NEXT MOVE</span></div><div className="loop-heading"><h2>The loop gets<br /><em>smarter with you.</em></h2><p>Scroll through the moments that make LearnLoop feel different.</p></div><div className="loop-layout"><div className="loop-steps"><button className={selectedMode === "diagnose" ? "active" : ""} onClick={() => setSelectedMode("diagnose")}><span>01</span><ScanIcon /> <strong>Diagnose</strong><ChevronRight size={14} /></button><button className={selectedMode === "teach" ? "active" : ""} onClick={() => setSelectedMode("teach")}><span>02</span><Layers3 size={17} /><strong>Teach</strong><ChevronRight size={14} /></button><button className={selectedMode === "adapt" ? "active" : ""} onClick={() => setSelectedMode("adapt")}><span>03</span><GitBranch size={17} /><strong>Adapt</strong><ChevronRight size={14} /></button></div><div className={`loop-card loop-${selectedMode}`}><div className="loop-card-top"><span>{selectedMode === "diagnose" ? "LIVE NOTE / 08" : selectedMode === "teach" ? "COACH OUTPUT / 02" : "NEXT SESSION / 01"}</span><span><i /> RESONANCE</span></div>{selectedMode === "diagnose" && <><div className="loop-card-icon"><CircleHelp size={22} /></div><h3>Find the gap<br />inside the answer.</h3><p>LearnLoop spots the step you skip — even when the final line is correct.</p><div className="loop-mini-note"><span>u = 3x² + 1</span><b>inner function missing</b></div></>}{selectedMode === "teach" && <><div className="loop-card-icon"><MessageCircle size={22} /></div><h3>Change the<br />shape of the help.</h3><p>A prompt, a map, or a worked example — chosen from the way you learn best.</p><div className="output-pills"><span>mind map</span><span>worked example</span><span className="selected">2 min prompt</span></div></>}{selectedMode === "adapt" && <><div className="loop-card-icon"><Zap size={22} /></div><h3>Make the next<br />move smaller.</h3><p>One focused practice, tied to one recurring pattern. No busywork.</p><div className="adapt-card"><Check size={14} /><span>separate inside / outside changes</span><ArrowRight size={14} /></div></>}</div></div></section>

        <section className="map-section page-section"><div className="map-copy"><div className="section-label"><span>04</span><span>YOUR LEARNING MODEL</span></div><h2>See where you are<br /><em>without the gamification.</em></h2><p>No streaks. No badges. Just a living map of the concepts you have actually demonstrated.</p><button className="text-link" onClick={() => setDemoOpen(true)}>View a sample map <ArrowUpRight size={15} /></button></div><div className="concept-map"><div className="map-grid" />{conceptNodes.map((node) => <div key={node.label} className={`concept-node ${node.state}`} style={{ left: node.x, top: node.y }}><span>{node.state === "gap" ? <CircleHelp size={12} /> : node.state === "done" ? <Check size={11} /> : <span />}</span>{node.label}</div>)}<svg className="concept-lines" viewBox="0 0 600 360" preserveAspectRatio="none"><path d="M95 145 L235 68 L372 160 L215 260 L470 276" /><path d="M235 68 L372 160" /></svg><div className="map-legend"><span><i className="legend-dot done" /> demonstrated</span><span><i className="legend-dot gap" /> needs evidence</span><span><i className="legend-dot locked" /> not yet</span></div></div></section>

        <section ref={finalSectionRef} className={`final-section ${finalVisible ? "is-visible" : ""}`} style={{ backgroundColor: "#09418e" }}><div className="final-grid" /><div className="final-copy"><div className="section-label light"><span>05</span><span>THE LAST TWO HOURS</span></div><h2>Stop rereading<br /><em>everything.</em></h2><p>Let the coach tell you what is worth your attention — because it was there when you learned it.</p><Link className="primary-button" href="/waitlist?focus=email">Request early access <ArrowUpRight size={16} /></Link></div><div className="final-ipad"><IpadProduct scrollY={0} compact /></div></section>
      </main>

      <footer className="site-footer"><a className="site-logo" href="#top"><span className="logo-symbol"><span /></span><strong>learnloop</strong></a><span>resident intelligence for the way you actually learn.</span><span>© 2025 resonance labs</span></footer>

      {demoOpen && <div className="modal-bg" onClick={() => setDemoOpen(false)}><div className="access-card" onClick={(event) => event.stopPropagation()}><button className="close-modal" onClick={() => setDemoOpen(false)}><X size={18} /></button>{emailSent ? <><div className="success-mark"><Check size={22} /></div><h3>You’re in the loop.</h3><p>We’ll send a thoughtful note when the private beta opens.</p><button className="secondary-button" onClick={() => setDemoOpen(false)}>Close</button></> : <><div className="product-eyebrow"><span className="eyebrow-pill">PRIVATE BETA</span> get an early look</div><h3>Make your notes<br /><em>work harder.</em></h3><p>Leave your email for the first look at LearnLoop’s notebook-native coaching loop.</p><div className="email-row"><input type="email" placeholder="you@somewhere.com" /><button onClick={() => setEmailSent(true)}>Join the loop <ArrowRight size={15} /></button></div><small>one useful email, never a noisy funnel.</small></>}</div></div>}
    </div>
  );
}

function ScanIcon() {
  return <span className="scan-icon"><span /><i /></span>;
}
