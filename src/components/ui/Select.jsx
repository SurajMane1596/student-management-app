import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const Select = forwardRef(function Select(
  { label, error, required, options, placeholder = "Select...", className, ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={props.id || props.name}
          className={clsx("input-base appearance-none pr-9", error && "input-error")}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export default Select;
