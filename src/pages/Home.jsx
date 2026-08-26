import { Link } from "react-router-dom";
import { User, Users, BookOpen, Phone, ArrowRight, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TILES = [
  {
    to: "/profile",
    label: "View Profile",
    desc: "View and edit your account details",
    icon: User,
    tone: "bg-primary-50 text-primary-600",
  },
  {
    to: "/customers",
    label: "View Customer",
    desc: "Manage student records",
    icon: Users,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    to: "/guide",
    label: "Guide",
    desc: "Learn how to use the app",
    icon: BookOpen,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    to: "/contact",
    label: "Contact Us",
    desc: "Get in touch with support",
    icon: Phone,
    tone: "bg-rose-50 text-rose-600",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-10 mt-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white mb-4">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome{user?.userName ? `, ${user.userName}` : ""}
        </h1>
        <p className="text-sm text-slate-500 mt-1">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TILES.map(({ to, label, desc, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className="card p-5 flex items-center gap-4 hover:shadow-md hover:border-primary-200 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800">{label}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            <ArrowRight
              size={18}
              className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
