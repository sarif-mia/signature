import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import NotFoundPage from "./pages/NotFoundPage";
export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const titles = { "/": "Signature Studio — Professional Email Signature Builder", "/builder": "Create Your Signature — Signature Studio" };
    document.title = titles[location.pathname] || "Page Not Found — Signature Studio";
  }, [location.pathname]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Routes><Route path="/" element={<HomePage />} /><Route path="/builder" element={<BuilderPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></>;
}
