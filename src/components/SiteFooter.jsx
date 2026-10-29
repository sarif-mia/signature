import Brand from "./Brand";
export default function SiteFooter() { return <footer className="site-footer"><Brand light /><p>Professional email signatures, made simple.</p><span>© {new Date().getFullYear()} Signature Studio</span></footer>; }
