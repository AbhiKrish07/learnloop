import React, { useState } from "react";
import {
  BookOpen,
  Folder,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Search,
  PenLine,
  FileText,
  Check,
  Sparkles,
  PanelRight,
  Zap,
  ArrowUpRight,
  BrainCircuit,
  Target,
  CircleHelp,
  Clock,
  TrendingUp,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2
} from "lucide-react";

export type ScreenId = "notebook" | "concept_map" | "practice" | "analytics";
export type DeviceFrame = "desktop" | "tablet" | "mobile";

interface ScreenMockupStudioProps {
  initialScreen?: ScreenId;
  initialDevice?: DeviceFrame;
}

export function ScreenMockupStudio({
  initialScreen = "notebook",
  initialDevice = "desktop",
}: ScreenMockupStudioProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(initialScreen);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>(initialDevice);
  const [practiceStep, setPracticeStep] = useState<number>(2);
  const [userInput, setUserInput] = useState<string>("(12x² + 2) / (4x³ + 2x)");
  const [inputFeedback, setInputFeedback] = useState<"none" | "correct" | "hint">("correct");

  return (
    <div className="screen-studio-container">
      {/* Studio Controls Header */}
      <div className="studio-control-bar">
        {/* Screen Tabs */}
        <div className="studio-tabs">
          <button
            className={`studio-tab ${activeScreen === "notebook" ? "active" : ""}`}
            onClick={() => setActiveScreen("notebook")}
          >
            <BookOpen size={14} />
            <span>01. Notebook & Coach</span>
          </button>
          <button
            className={`studio-tab ${activeScreen === "concept_map" ? "active" : ""}`}
            onClick={() => setActiveScreen("concept_map")}
          >
            <BrainCircuit size={14} />
            <span>02. Knowledge Map</span>
          </button>
          <button
            className={`studio-tab ${activeScreen === "practice" ? "active" : ""}`}
            onClick={() => setActiveScreen("practice")}
          >
            <Target size={14} />
            <span>03. Micro-Practice</span>
          </button>
          <button
            className={`studio-tab ${activeScreen === "analytics" ? "active" : ""}`}
            onClick={() => setActiveScreen("analytics")}
          >
            <Activity size={14} />
            <span>04. Study Analytics</span>
          </button>
        </div>

        {/* Device Proportions Switcher */}
        <div className="device-frame-selector">
          <span className="selector-label">FRAME:</span>
          <button
            className={`frame-btn ${deviceFrame === "desktop" ? "active" : ""}`}
            onClick={() => setDeviceFrame("desktop")}
            title="Desktop 16:10 Proportions"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            className={`frame-btn ${deviceFrame === "tablet" ? "active" : ""}`}
            onClick={() => setDeviceFrame("tablet")}
            title="iPad Pro 4:3 Proportions"
          >
            <Tablet size={14} />
            <span>iPad Pro</span>
          </button>
          <button
            className={`frame-btn ${deviceFrame === "mobile" ? "active" : ""}`}
            onClick={() => setDeviceFrame("mobile")}
            title="Mobile 9:19 Proportions"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Realistic Proportional Device Container */}
      <div className={`device-viewport-wrapper frame-${deviceFrame}`}>
        {/* Device Shell Frame */}
        <div className="device-outer-frame">
          {/* macOS Top Window Header (for desktop) */}
          {deviceFrame === "desktop" && (
            <div className="mac-window-header">
              <div className="window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="window-title">LearnLoop Workspace — Calculus & Computer Science</div>
              <div className="window-actions">
                <span className="badge-live"><i className="live-dot" /> Resident Coach Active</span>
              </div>
            </div>
          )}

          {/* iPad / Tablet Top Bar */}
          {deviceFrame === "tablet" && (
            <div className="tablet-status-bar">
              <span>9:41 AM Mon Oct 14</span>
              <div className="camera-notch" />
              <div className="status-icons">
                <span>100% ⚡</span>
              </div>
            </div>
          )}

          {/* Mobile Status Bar */}
          {deviceFrame === "mobile" && (
            <div className="mobile-status-bar">
              <span>09:41</span>
              <div className="island-pill" />
              <span>5G 🔋</span>
            </div>
          )}

          {/* Screen Content View */}
          <div className="device-screen-content">
            {/* SCREEN 1: NOTEBOOK & AI COACH */}
            {activeScreen === "notebook" && (
              <div className="app-screen-layout notebook-screen">
                {/* Sidebar */}
                {deviceFrame !== "mobile" && (
                  <aside className="mock-sidebar">
                    <div className="mock-brand">
                      <span className="brand-dot" />
                      <strong>learnloop</strong>
                    </div>
                    <div className="sidebar-section-title">WORKSPACES</div>
                    <div className="sidebar-item active">
                      <BookOpen size={14} />
                      <span>Calculus / Foundations</span>
                    </div>
                    <div className="sidebar-item">
                      <Folder size={14} />
                      <span>Computer Science</span>
                    </div>
                    <div className="sidebar-item">
                      <Folder size={14} />
                      <span>Linear Algebra</span>
                    </div>

                    <div className="sidebar-divider" />

                    <div className="sidebar-section-title">RECENT SESSIONS</div>
                    <div className="sidebar-item note-link">
                      <span className="recent-indicator blue" />
                      <span>Chain rule — session 08</span>
                    </div>
                    <div className="sidebar-item note-link">
                      <span className="recent-indicator yellow" />
                      <span>Computational graphs</span>
                    </div>
                    <div className="sidebar-item note-link">
                      <span className="recent-indicator pink" />
                      <span>Derivative shortcuts</span>
                    </div>
                  </aside>
                )}

                {/* Main Editor */}
                <main className="mock-editor-area">
                  <div className="editor-top-nav">
                    <div className="breadcrumbs">
                      <span>Calculus</span>
                      <ChevronRight size={12} />
                      <strong>Chain rule — session 08</strong>
                    </div>
                    <div className="editor-actions">
                      <span className="pen-mode-tag"><PenLine size={13} /> Pencil Active</span>
                      <Search size={14} />
                      <MoreHorizontal size={14} />
                    </div>
                  </div>

                  <div className="editor-canvas">
                    <div className="document-header">
                      <div className="doc-icon"><FileText size={16} /></div>
                      <div>
                        <h2>Chain rule — when functions nest</h2>
                        <p className="doc-date">Updated 12 mins ago · 4th calculus entry</p>
                      </div>
                    </div>

                    <div className="note-body-text">
                      <p className="lead-paragraph">
                        If <code>y = f(g(x))</code>, the rate of change depends on both the outer function rate and inner function rate multiplied together:
                      </p>

                      <div className="math-display-box">
                        <span className="math-lhs">dy / dx</span>
                        <span className="math-eq">=</span>
                        <span className="math-fraction">
                          <span className="num">dy</span>
                          <span className="den">du</span>
                        </span>
                        <span className="math-op">•</span>
                        <span className="math-fraction">
                          <span className="num">du</span>
                          <span className="den">dx</span>
                        </span>
                      </div>

                      <div className="handwriting-callout">
                        <span className="callout-label">STUDY OBSERVATION:</span>
                        <p>Outer derivative <em>evaluated at inner function</em> × derivative of inside.</p>
                      </div>

                      <div className="worked-problem-box">
                        <div className="problem-head">
                          <span className="prob-tag">WORKED ENTRY #03</span>
                          <span className="prob-status"><Check size={12} /> Verified</span>
                        </div>
                        <p className="prob-expression">f(x) = sin(3x² + 1)</p>
                        <div className="step-breakdown">
                          <div className="step-line"><span>Outer:</span> <code>sin(u) → cos(u)</code></div>
                          <div className="step-line"><span>Inner:</span> <code>u = 3x² + 1 → 6x</code></div>
                          <div className="step-result">f′(x) = cos(3x² + 1) • <strong className="highlight-blue">6x</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>

                {/* Right AI Coach Panel */}
                {deviceFrame === "desktop" && (
                  <aside className="mock-coach-drawer">
                    <div className="coach-drawer-head">
                      <div className="coach-badge">
                        <Sparkles size={13} />
                        <span>RESONANCE INSIGHT</span>
                      </div>
                      <PanelRight size={14} />
                    </div>

                    <div className="coach-insight-card">
                      <div className="insight-tag">PATTERN DETECTED</div>
                      <h4>Hidden Step Skipped</h4>
                      <p>
                        You arrived at the correct answer, but omitted explicitly writing the inner derivative <code>du/dx</code> step.
                      </p>

                      <div className="evidence-tracker">
                        <div className="tracker-title">
                          <span>3 RECENT SESSIONS</span>
                          <span>75% FREQUENCY</span>
                        </div>
                        <div className="tracker-bars">
                          <span className="bar high" />
                          <span className="bar high" />
                          <span className="bar mid" />
                          <span className="bar low" />
                        </div>
                      </div>

                      <button className="btn-coach-action" onClick={() => setActiveScreen("practice")}>
                        <span>Launch 2-min focused prompt</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </aside>
                )}
              </div>
            )}

            {/* SCREEN 2: CONCEPT MAP & KNOWLEDGE TREE */}
            {activeScreen === "concept_map" && (
              <div className="app-screen-layout concept-screen">
                <div className="concept-toolbar">
                  <div className="concept-title-group">
                    <h3>Calculus & Analysis Mastery Map</h3>
                    <span className="mastery-badge">6 Topics Demonstrated</span>
                  </div>
                  <div className="concept-legend">
                    <span className="legend-item master"><i /> Demonstrated</span>
                    <span className="legend-item gap"><i /> Gap Detected</span>
                    <span className="legend-item current"><i /> Active Focus</span>
                  </div>
                </div>

                <div className="concept-canvas-grid">
                  {/* Graph Nodes */}
                  <div className="node-item master" style={{ top: "25%", left: "18%" }}>
                    <CheckCircle2 size={14} />
                    <div>
                      <strong>Functions & Limits</strong>
                      <small>Mastery 94%</small>
                    </div>
                  </div>

                  <div className="node-item master" style={{ top: "25%", left: "55%" }}>
                    <CheckCircle2 size={14} />
                    <div>
                      <strong>Derivatives & Slope</strong>
                      <small>Mastery 88%</small>
                    </div>
                  </div>

                  <div className="node-item gap" style={{ top: "60%", left: "32%" }}>
                    <AlertCircle size={14} />
                    <div>
                      <strong>Function Composition</strong>
                      <small>Gap: Missing inner term</small>
                    </div>
                  </div>

                  <div className="node-item current" style={{ top: "60%", left: "70%" }}>
                    <Zap size={14} />
                    <div>
                      <strong>Chain Rule</strong>
                      <small>Current Focus</small>
                    </div>
                  </div>

                  <div className="node-item upcoming" style={{ top: "82%", left: "50%" }}>
                    <HelpCircle size={14} />
                    <div>
                      <strong>Backpropagation</strong>
                      <small>Prerequisites 80%</small>
                    </div>
                  </div>

                  {/* Connecting lines */}
                  <svg className="graph-lines-svg" viewBox="0 0 800 450">
                    <line x1="220" y1="120" x2="440" y2="120" className="line-active" />
                    <line x1="220" y1="120" x2="260" y2="270" className="line-active" />
                    <line x1="440" y1="120" x2="560" y2="270" className="line-active" />
                    <line x1="260" y1="270" x2="560" y2="270" className="line-gap" />
                    <line x1="560" y1="270" x2="400" y2="370" className="line-dashed" />
                  </svg>
                </div>
              </div>
            )}

            {/* SCREEN 3: MICRO-PRACTICE ENGINE */}
            {activeScreen === "practice" && (
              <div className="app-screen-layout practice-screen">
                <div className="practice-card-wrapper">
                  <div className="practice-header">
                    <div className="practice-step-tag">2-MIN RESONANCE DRILL</div>
                    <h2>Differentiate: f(x) = ln(4x³ + 2x)</h2>
                    <p className="practice-prompt">Break down the inner function explicitly before applying the derivative.</p>
                  </div>

                  <div className="practice-steps-list">
                    {/* Step 1 */}
                    <div className="step-card completed">
                      <div className="step-num"><Check size={12} /></div>
                      <div className="step-body">
                        <strong>Step 1: Identify Outer & Inner Functions</strong>
                        <code>u = 4x³ + 2x,   f(u) = ln(u)</code>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="step-card active">
                      <div className="step-num">2</div>
                      <div className="step-body">
                        <strong>Step 2: Differentiate inner function u(x)</strong>
                        <div className="step-formula">
                          <span>du/dx = </span>
                          <span className="formula-highlight">12x² + 2</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="step-card focus">
                      <div className="step-num">3</div>
                      <div className="step-body">
                        <strong>Step 3: Combine with Chain Rule formula f′(x) = (1/u) • u′</strong>
                        <div className="input-group-custom">
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Enter combined expression..."
                          />
                          <button
                            className="btn-submit-step"
                            onClick={() => setInputFeedback("correct")}
                          >
                            Verify Step
                          </button>
                        </div>

                        {inputFeedback === "correct" && (
                          <div className="feedback-pill success">
                            <CheckCircle2 size={14} />
                            <span>Spot on! Inner derivative explicitly multiplied. Pattern verified.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 4: STUDY ANALYTICS & TIMELINE */}
            {activeScreen === "analytics" && (
              <div className="app-screen-layout analytics-screen">
                <div className="analytics-header">
                  <div>
                    <h3>Study Session Analytics & Pattern Log</h3>
                    <p>Observed study behavior from your real notes & practice.</p>
                  </div>
                  <div className="time-range-picker">
                    <span className="active">Last 7 Days</span>
                    <span>30 Days</span>
                  </div>
                </div>

                <div className="analytics-stats-grid">
                  <div className="stat-card">
                    <Clock size={16} />
                    <div className="stat-val">3h 45m</div>
                    <div className="stat-lbl">Active Note Study</div>
                  </div>
                  <div className="stat-card">
                    <BrainCircuit size={16} />
                    <div className="stat-val">92%</div>
                    <div className="stat-lbl">Concept Retention</div>
                  </div>
                  <div className="stat-card">
                    <Target size={16} />
                    <div className="stat-val">4 Gaps</div>
                    <div className="stat-lbl">Resolved this week</div>
                  </div>
                </div>

                <div className="analytics-timeline-box">
                  <h4>Session Velocity & Gap Resolution Log</h4>
                  <div className="timeline-items">
                    <div className="timeline-row">
                      <span className="row-time">Today, 2:15 PM</span>
                      <span className="row-topic">Calculus: Chain Rule Session 08</span>
                      <span className="row-status gap">Inner Step Gap</span>
                    </div>
                    <div className="timeline-row">
                      <span className="row-time">Yesterday, 4:30 PM</span>
                      <span className="row-topic">CS: Computational Graphs</span>
                      <span className="row-status resolved">Resolved</span>
                    </div>
                    <div className="timeline-row">
                      <span className="row-time">Oct 12, 11:00 AM</span>
                      <span className="row-topic">Calculus: Derivative Shortcuts</span>
                      <span className="row-status resolved">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
