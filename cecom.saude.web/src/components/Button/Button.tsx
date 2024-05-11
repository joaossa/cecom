import classNames from "classnames";

type Props = {
  type?: "button" | "submit";
  children: React.ReactNode;
  onClick?: VoidFunction;
  className?: string;
};

export function Button({
  type = "button",
  children,
  onClick,
  className,
}: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        "mt-4 rounded-lg bg-blue-color px-2 py-2 text-base font-light text-white outline-none hover:bg-cyan-500 transition-all",
        className
      )}
    >
      {children}
    </button>
  );
}
