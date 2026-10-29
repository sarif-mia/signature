import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function NotFoundPage() {
  return <div className="not-found-page"><SiteHeader /><main id="main-content" className="not-found"><span className="not-found-code">404</span><span className="eyebrow"><i /> Page not found</span><h1>This page left without a signature.</h1><p>The link may be outdated, but your next email can still look excellent.</p><Link className="button primary coral" to="/"><ArrowLeft size={16} /> Back to homepage</Link></main><SiteFooter /></div>;
}
