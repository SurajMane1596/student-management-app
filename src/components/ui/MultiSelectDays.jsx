import clsx from "clsx";

/**
 * Multi-select control for the "School Days" field. Rendered as a group
 * of toggle chips rather than a native <select multiple> for a far better
 * touch/click UX, while still producing a plain string[] value that plugs
 * straight into React Hook Form via a Controller.
 */
export default function MultiSelectDays({ label, error, required, options, value = [], onChange }) {
  function toggle(day) {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  }

  return (
    <div>
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((day) => {
          const selected = value.includes(day);
          return (
            <button
              type="button"
              key={day}
              onClick={() => toggle(day)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                selected
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
              )}
            >
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
