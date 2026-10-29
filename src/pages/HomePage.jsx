import { ArrowRight, BadgeCheck, Brush, Check, Code2, Copy, LayoutTemplate, LockKeyhole, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function HomePage() {
  return <div className="home-page"><SiteHeader /><main id="main-content">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow light"><i /> Professional email identity</span><h1>Make every email feel <em>distinctly yours.</em></h1><p>Build a polished, on-brand email signature in minutes. No coding, no account, and no design guesswork.</p><div className="hero-actions"><Link className="button primary coral" to="/builder">Create my signature <ArrowRight size={17} /></Link><a className="text-link" href="#how">See how it works</a></div><ul className="hero-checks"><li><Check /> Free to use</li><li><Check /> Email-safe HTML</li><li><Check /> Stored in your browser</li></ul></div>
      <div className="hero-demo"><div className="demo-orbit" /><div className="mail-card"><div className="mail-top"><span /><span /><span /><b>New message</b></div><div className="mail-lines"><span>To: client@northstar.co</span><span>Subject: Great speaking with you</span></div><div className="mail-body"><p>Hi Alex,</p><p>Thanks again for your time today. Here are the details we discussed.</p><div className="sample-signature"><div className="sample-avatar">AM</div><div><strong>Alex Morgan</strong><b>Brand Manager · Acme Studio</b><span>alex.morgan@example.com &nbsp; · &nbsp; +1 (555) 012-3456</span><span>San Francisco, CA &nbsp; · &nbsp; example.com</span><small>in &nbsp; gh</small></div></div></div></div><span className="floating-chip chip-one"><BadgeCheck /> Email ready</span><span className="floating-chip chip-two"><Brush /> Fully customizable</span></div>
    </section>

    <section className="trust-strip"><span>Works beautifully with</span><div><b>Google</b><b>Outlook</b><b>Apple Mail</b><b>Yahoo!</b><b>Thunderbird</b></div></section>

    <section id="features" className="feature-section section-wrap"><div className="section-heading centered"><span className="eyebrow"><i /> Everything you need</span><h2>A professional finish, without the fuss.</h2><p>Built for reliable rendering, effortless editing, and a strong first impression.</p></div><div className="feature-grid">
      <Feature icon={<LayoutTemplate />} title="Professional layouts" text="Choose inside the builder from versatile, email-safe designs for every kind of role." />
      <Feature icon={<Brush />} title="Brand-level control" text="Adjust color, typography, spacing, imagery, CTA, banner, and disclaimer." />
      <Feature icon={<Copy />} title="Copy in one click" text="Copy rich HTML directly into Gmail, Outlook, Apple Mail, and more." />
      <Feature icon={<Smartphone />} title="Responsive by design" text="Layouts stay clear and compact across desktop and mobile inboxes." />
      <Feature icon={<LockKeyhole />} title="Private by default" text="Your profile stays in your own browser. No sign-up or server upload." />
      <Feature icon={<Code2 />} title="Clean HTML export" text="Download a standalone HTML signature with dependable inline styles." />
    </div></section>

    <section id="how" className="how-section"><div className="section-wrap how-grid"><div><span className="eyebrow light"><i /> Simple workflow</span><h2>From blank canvas to inbox-ready.</h2><p>Everything happens in one focused workspace, with a live email preview beside your controls.</p><Link className="button primary light-button" to="/builder">Start building <ArrowRight size={17} /></Link></div><ol><Step n="01" title="Choose in the builder" text="Pick the layout that matches your role and brand." /><Step n="02" title="Add your identity" text="Enter contact details, social links, logo, photo, and extras." /><Step n="03" title="Copy and install" text="Paste into your email client or download the HTML file." /></ol></div></section>

    <section className="final-cta section-wrap"><div><span className="eyebrow"><i /> Ready when you are</span><h2>Your next email deserves a better sign-off.</h2><p>Build a signature that looks considered, credible, and completely yours.</p></div><Link className="button primary coral" to="/builder">Create free signature <ArrowRight size={17} /></Link></section>
  </main><SiteFooter /></div>;
}

function Feature({ icon, title, text }) { return <article className="feature-card"><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>; }
function Step({ n, title, text }) { return <li><b>{n}</b><div><h3>{title}</h3><p>{text}</p></div></li>; }
