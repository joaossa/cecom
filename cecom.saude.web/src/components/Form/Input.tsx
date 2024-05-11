import React from "react";
import { InputErrorMessage } from "./InputErrorMessage";
import classNames from "classnames";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { label?: string; errors?: any; className?: string };

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, errors, name, className, ...props }: Props, ref) => {
    return (
      <div
        className={classNames(
          "flex flex-col items-start justify-start gap-1",
          className
        )}
      >
        {label && (
          <label className="mt-5 text-sm font-semibold">{label}:</label>
        )}
        <input
          {...props}
          ref={ref}
          className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition-all focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <InputErrorMessage name={name} errors={errors} />
      </div>
    );
  }
);
