import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, required, className, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={props.id || props.name}
          type={visible ? "text" : "password"}
          className={clsx("input-base pr-10", error && "input-error")}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export default PasswordInput;
