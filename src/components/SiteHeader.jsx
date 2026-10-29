import { ArrowRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import Brand from "./Brand";
export default function SiteHeader({ builder = false }) { return <header className={`site-header ${builder ? "builder-header" : ""}`}><Brand /><nav>{builder ? <Link to="/">Back to home</Link> : <><a href="#features">Features</a><a href="#how">How it works</a></>}<NavLink className="header-cta" to="/builder">Create signature <ArrowRight size={15} /></NavLink></nav></header>; }
