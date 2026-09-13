import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Plus,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Layers,
  ArrowRight,
  User as UserIcon,
  LogOut,
  Bell,
  Sliders,
  Share2,
  FileText,
  Code,
  Tag
} from "lucide-react";
import { toast } from "sonner";

interface CaptureItem {
  id: string;
  title: string;
  content: string;
  category: "concept" | "code" | "article" | "idea" | "paper";
  tags: string[];
  createdAt: string;
  masteryScore: number;
  nextReviewAt?: string;
}

export default function Dashboard() {
  const [captures, setCaptures] = useState<CaptureItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "cards" | "practice" | "settings">("overview");
  const [isCapturing, setIsCapturing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<CaptureItem["category"]>("concept");
  const [newTagStr, setNewTagStr] = useState("");
  const [loading, setLoading] = useState(false);

  // Review Flashcard state
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Tour & Onboarding state
  const [showTourBanner, setShowTourBanner] = useState(true);

  useEffect(() => {
    fetchCaptures();
  }, []);

  const handleExportMarkdown = () => {
    const mdContent = captures.map(c => `# ${c.title}\n**Category:** ${c.category} | **Mastery:** ${c.masteryScore}%\n**Tags:** ${c.tags.join(", ")}\n\n${c.content}\n\n---`).join("\n\n");
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnloop-captures-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${captures.length} capture items to Markdown!`);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(captures, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnloop-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${captures.length} capture items to JSON backup!`);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setCaptures(prev => [...imported, ...prev]);
          toast.success(`Imported ${imported.length} new capture items!`);
        } else {
          toast.error("Invalid JSON format");
        }
      } catch {
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  const fetchCaptures = async () => {
    try {
      const res = await fetch("/api/captures");
      const data = await res.json();
      if (data.success && data.captures) {
        setCaptures(data.captures);
      }
    } catch {
      toast.error("Failed to load memory captures");
    }
  };

  const handleAddCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please provide both title and content");
      return;
    }

    setLoading(true);
    try {
      const tags = newTagStr.split(",").map(t => t.trim()).filter(Boolean);
      const res = await fetch("/api/captures/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          tags: tags.length ? tags : ["Captured"]
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Capture synthesized into knowledge graph!");
        setCaptures(prev => [data.capture, ...prev]);
        setNewTitle("");
        setNewContent("");
        setNewTagStr("");
        setIsCapturing(false);
      } else {
        toast.error(data.error || "Failed to add capture");
      }
    } catch {
      toast.error("Server error creating capture");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreReview = async (id: string, delta: number) => {
    try {
      const res = await fetch("/api/captures/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, delta })
      });
      const data = await res.json();
      if (data.success && data.capture) {
        setCaptures(prev => prev.map(c => c.id === id ? data.capture : c));
        toast.success(delta > 0 ? "+15% Retention score boost!" : "Card queued for earlier review");
        setIsFlipped(false);
        setPracticeIndex(prev => (prev + 1) % Math.max(1, captures.length));
      }
    } catch {
      toast.error("Error updating review score");
    }
  };

  const filteredCaptures = captures.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const avgMastery = captures.length
    ? Math.round(captures.reduce((acc, curr) => acc + curr.masteryScore, 0) / captures.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                LearnLoop AI
              </span>
            </Link>
            <span className="hidden md:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Interactive Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCapturing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-500/40 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Capture</span>
            </button>

            <Link href="/" className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Exit Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80 w-fit">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "cards", label: "Knowledge Graph", icon: BookOpen },
              { id: "practice", label: "Resonance Loop", icon: RefreshCw },
              { id: "settings", label: "Settings", icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts, tags, or notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-sm font-medium">Total Captures</span>
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-3xl font-bold text-white">{captures.length}</div>
                <div className="text-xs text-slate-500 mt-1">Items saved in memory graph</div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-sm font-medium">Avg. Memory Retention</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white">{avgMastery}%</div>
                <div className="text-xs text-emerald-400/90 mt-1">+8% since last practice session</div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-sm font-medium">Next Review Due</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {captures.filter(c => c.masteryScore < 80).length} items
                </div>
                <div className="text-xs text-amber-400/90 mt-1">Ready for Resonance Loop</div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-sm font-medium">Active Agent State</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </div>
                <div className="text-xs text-slate-500 mt-1">Auto-indexing active</div>
              </div>
            </div>

            {/* Quick Banner & Actions */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Resonance Engine Ready</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Reinforce your knowledge graph today</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You have concepts queued for optimal retention review according to Ebbinghaus memory decay curves.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("practice")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <span>Start Review Loop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recent Captures Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Memory Captures</h3>
                <button
                  onClick={() => setActiveTab("cards")}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View All ({captures.length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredCaptures.slice(0, 3).map(item => (
                  <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.masteryScore}% Mastery
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-white mb-2 line-clamp-1">{item.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{item.content}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-800/60">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-xs text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: KNOWLEDGE CARDS */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Knowledge Graph Cards ({filteredCaptures.length})</h3>
              <button
                onClick={() => setIsCapturing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Capture</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaptures.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/60 border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{item.masteryScore}%</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2 leading-snug">{item.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-4">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleScoreReview(item.id, 15)}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="Quick boost retention score"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: RESONANCE PRACTICE LOOP */}
        {activeTab === "practice" && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Resonance Recall Practice</h3>
              <p className="text-slate-400 text-sm">
                Test your memory recall. Flip card to check answer & score retention strength.
              </p>
            </div>

            {captures.length > 0 ? (
              <div className="relative space-y-6">
                {/* Flashcard Component */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[300px] bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Card {practiceIndex + 1} of {captures.length}</span>
                    <span className="text-indigo-400 font-semibold uppercase tracking-wider">
                      {isFlipped ? "Answer / Details" : "Front Prompt"}
                    </span>
                  </div>

                  <div className="my-auto py-6 text-center space-y-4">
                    <h4 className="text-2xl font-bold text-white leading-tight">
                      {captures[practiceIndex]?.title}
                    </h4>

                    {isFlipped ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-base text-slate-300 leading-relaxed max-w-lg mx-auto"
                      >
                        {captures[practiceIndex]?.content}
                      </motion.p>
                    ) : (
                      <p className="text-sm text-indigo-400/80 italic">
                        Click card to reveal answer
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
                    <span>Category: {captures[practiceIndex]?.category}</span>
                    <span>Current Mastery: {captures[practiceIndex]?.masteryScore}%</span>
                  </div>
                </div>

                {/* Score Controls */}
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <button
                      onClick={() => handleScoreReview(captures[practiceIndex].id, -10)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Needs Review (-10%)</span>
                    </button>

                    <button
                      onClick={() => handleScoreReview(captures[practiceIndex].id, 15)}
                      className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Got It Right (+15%)</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                No capture items found. Add items via Quick Capture!
              </div>
            )}
          </div>
        )}

        {/* Tab 4: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Workspace Preferences</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Auto Spaced Repetition Reminders</h4>
                  <p className="text-xs text-slate-400">Receive notifications when items reach review threshold</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">AI Concept Extraction</h4>
                  <p className="text-xs text-slate-400">Automatically parse captured articles into flashcard loops</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">Knowledge Graph Data Transfer</h4>
                  <p className="text-xs text-slate-400">Export or restore your captures in Markdown or JSON backup format</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportMarkdown}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    Markdown
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Export JSON
                  </button>
                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                    Import JSON
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Capture Modal Overlay */}
      <AnimatePresence>
        {isCapturing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span>Synthesize Quick Capture</span>
                </div>
                <button
                  onClick={() => setIsCapturing(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCapture} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Concept Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Vector Embeddings & Cosine Similarity"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="concept">Concept</option>
                      <option value="code">Code</option>
                      <option value="article">Article</option>
                      <option value="idea">Idea</option>
                      <option value="paper">Paper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="AI, Math, ML"
                      value={newTagStr}
                      onChange={e => setNewTagStr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Content / Explanation / Key takeaways
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter main points or notes here..."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCapturing(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    {loading ? "Synthesizing..." : "Save Capture"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
