import React, { useState } from "react";
import { InputErrorMessage } from "./InputErrorMessage";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import classNames from "classnames";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  errors?: any;
  className?: string;
};

export const InputPassword = React.forwardRef<HTMLInputElement, Props>(
  ({ label, errors, name, className, ...props }: Props, ref) => {
    const [visiblePassword, setVisiblePassword] = useState(false);

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
        <div className="flex w-full justify-between rounded-md border border-gray-300 px-4 py-3 outline-none transition-all focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50">
          <input
            {...props}
            ref={ref}
            type={visiblePassword ? "text" : "password"}
            className="w-full outline-none"
          />
          <div className="flex items-center text-neutral-400">
            {visiblePassword ? (
              <AiOutlineEyeInvisible
                size={18}
                className="hover:cursor-pointer"
                onClick={() => setVisiblePassword(false)}
              />
            ) : (
              <AiOutlineEye
                size={18}
                className="hover:cursor-pointer"
                onClick={() => setVisiblePassword(true)}
              />
            )}
          </div>
        </div>

        <InputErrorMessage name={name} errors={errors} />
      </div>
    );
  }
);
