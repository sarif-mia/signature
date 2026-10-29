import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); document.title = location.pathname === "/builder" ? "Create Your Signature — Signature Studio" : "Signature Studio — Professional Email Signature Builder"; }, [location.pathname]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Routes><Route path="/" element={<HomePage />} /><Route path="/builder" element={<BuilderPage />} /><Route path="*" element={<HomePage />} /></Routes></>;
}
