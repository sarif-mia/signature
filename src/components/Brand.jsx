import { Link } from "react-router-dom";
export default function Brand({ light = false }) { return <Link className={`brand ${light ? "brand-light" : ""}`} to="/" aria-label="Signature Studio home"><img className="brand-mark" src="/brand-mark.svg" alt="" width="38" height="38" /><span className="brand-wordmark"><strong>Signature</strong><small>Studio</small></span></Link>; }
