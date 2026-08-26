import { forwardRef } from "react";
import clsx from "clsx";

const TextArea = forwardRef(function TextArea(
  { label, error, required, maxLength, className, ...props },
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
      <textarea
        ref={ref}
        id={props.id || props.name}
        rows={4}
        maxLength={maxLength}
        className={clsx("input-base resize-none", error && "input-error")}
        {...props}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export default TextArea;
