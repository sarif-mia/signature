import { Link } from "react-router-dom";
export default function Brand({ light = false }) { return <Link className={`brand ${light ? "brand-light" : ""}`} to="/" aria-label="Signature Studio home"><span className="brand-symbol">S</span><span>Signature Studio</span></Link>; }
