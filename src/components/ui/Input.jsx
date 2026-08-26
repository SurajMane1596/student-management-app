import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(function Input(
  { label, error, required, hint, className, ...props },
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
      <input
        ref={ref}
        id={props.id || props.name}
        className={clsx("input-base", error && "input-error")}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export default Input;
