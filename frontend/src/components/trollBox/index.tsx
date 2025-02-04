import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  className?: string;
}

const TrollBox: React.FC<IProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        "w-full bg-white dark:bg-black rounded-lg p-5",
        className
      )}
    >
      <div className="text-[#3E8ED4] text-lg my-3">Troll - Box</div>
      <div className="flex flex-col gap-1">
        Coming Soon.
      </div>
    </div>
  );
};

export default TrollBox;
