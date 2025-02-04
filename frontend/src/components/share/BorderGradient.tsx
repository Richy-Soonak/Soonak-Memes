import React from "react";
import { twMerge } from "tailwind-merge";

const BorderGradient = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-[#3E8ED4] via-[#CE1328]  to-[#BC8C5B] p-[1px]">
      <div
        className={twMerge(
          "w-full h-full bg-white dark:bg-black rounded-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGradient;
