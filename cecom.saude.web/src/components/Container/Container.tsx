import React from "react";

type Props = {
  children: React.ReactNode;
};

export function Container({ children }: Props) {
  return (
    <div className="h-[100vh] flex items-center justify-center w-1/3 shadow-2xl rounded-r-[32px] bg-white max-lg:w-full max-md:rounded-none max-md:shadow-none">
      {children}
    </div>
  );
}
