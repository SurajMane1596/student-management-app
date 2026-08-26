import clsx from "clsx";

export function Badge({ children, tone = "slate" }) {
  const tones = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function Spinner({ className }) {
  return (
    <svg
      className={clsx("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function SectionCard({ title, children, className }) {
  return (
    <div className={clsx("card p-5 sm:p-6", className)}>
      {title && <h3 className="text-sm font-semibold text-slate-800 mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function PageHeading({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
