"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className={`app-shell${sidebarOpen ? " sidebar-open" : ""}`}>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="app-main">
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className="app-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
