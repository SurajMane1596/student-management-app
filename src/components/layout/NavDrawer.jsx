import { X, User, LogOut, Phone, BookOpen, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/profile", label: "View Profile", icon: User },
  { to: "/customers", label: "View Customer", icon: Users },
  { to: "/guide", label: "User Guide", icon: BookOpen },
  { to: "/contact", label: "Contact", icon: Phone },
];

export default function NavDrawer({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    onClose();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-slate-900/40 z-40 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel, slides from the right */}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl border-l border-slate-200",
          "flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
          <span className="font-semibold text-slate-800">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                    : "text-slate-600 hover:bg-slate-50"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
