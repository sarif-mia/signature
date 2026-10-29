import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
export default function App() { return <Routes><Route path="/" element={<HomePage />} /><Route path="/builder" element={<BuilderPage />} /><Route path="*" element={<HomePage />} /></Routes>; }
