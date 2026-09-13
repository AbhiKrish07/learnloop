import { ArrowLeft, ArrowRight, Check, Mail, Moon, PartyPopper, Share2, ShieldCheck, Sun } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function WaitingList() {
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("learnloop-theme") as "light" | "dark") || "light");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  useEffect(() => { document.documentElement.classList.add("theme-transition"); document.documentElement.classList.toggle("dark", theme === "dark"); localStorage.setItem("learnloop-theme", theme); const timer = window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 280); return () => window.clearTimeout(timer); }, [theme]);
  const submitWaitlist = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const email = String(new FormData(event.currentTarget).get("email") || ""); if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Please enter a valid email address so we know where to send your invite."); return; } setError(""); setLoading(true); window.setTimeout(() => { setLoading(false); setSubmitted(true); }, 850); };
  const shareWaitlist = async () => { const shareData = { title: "LearnLoop private beta", text: "I just joined the LearnLoop private beta waitlist.", url: window.location.origin }; try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`); setShareCopied(true); window.setTimeout(() => setShareCopied(false), 2200); } } catch { setShareCopied(false); } };
  return (
    <main className="waitlist-page">
      <div className="waitlist-orb" />
      <header className="waitlist-header">
        <Link className="site-logo" href="/"><span className="logo-symbol"><span /></span><strong>learnloop</strong></Link>
        <div className="waitlist-header-actions"><button className="theme-toggle" aria-label="Toggle theme" onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={14} /> : <Sun size={14} />}</button><Link className="back-link" href="/"><ArrowLeft size={14} /> Back to the product</Link></div>
      </header>
      <section className="waitlist-content">
        <div className="waitlist-eyebrow"><span className="eyebrow-pill">PRIVATE BETA</span> notebook-native learning</div>
        <h1>Be there when<br /><em>the resident moves in.</em></h1>
        <p>LearnLoop is being built for the moment before an exam when rereading everything is not the answer. Join the list for the first look at the workspace and the private beta.</p>
        {submitted ? <div className="waitlist-success"><div className="success-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></div><span><Check size={18} /></span><strong>You’re on the list.</strong><p>We’ll send one useful note when the private beta opens.</p><button className="share-button-large" title={shareCopied ? "Link copied to clipboard" : "Share LearnLoop"} onClick={shareWaitlist}><Share2 size={15} /> {shareCopied ? "Link copied" : "Share the news"}{shareCopied && <span className="copy-tooltip" role="status">Copied</span>}</button><small className="success-share-note"><PartyPopper size={13} /> Invite a thoughtful study partner.</small></div> : <form className="waitlist-form" noValidate onSubmit={submitWaitlist}><label htmlFor="waitlist-email">Your email</label><div><Mail size={16} /><input id="waitlist-email" name="email" autoFocus type="email" placeholder="you@somewhere.com" /><button type="submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Joining…</> : <>Join the waitlist <ArrowRight size={15} /></>}</button></div>{error && <p className="waitlist-error" role="alert">{error}</p>}<small><ShieldCheck size={13} /> No noise. No selling your notes. Just a thoughtful update.</small></form>}
        <div className="waitlist-points"><span><Check size={13} /> notebook-first</span><span><Check size={13} /> evidence over memory</span><span><Check size={13} /> built for real studying</span></div>
      </section>
      <footer className="waitlist-footer">© 2025 RESONANCE LABS <span>learnloop / private beta</span></footer>
    </main>
  );
}
