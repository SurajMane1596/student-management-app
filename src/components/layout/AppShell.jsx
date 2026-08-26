import { useState } from "react";
import { Menu, ArrowLeft, GraduationCap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import NavDrawer from "./NavDrawer";

export default function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/home";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-slate-800 tracking-tight">
                Student<span className="text-primary-600">Manage</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">{children}</main>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
