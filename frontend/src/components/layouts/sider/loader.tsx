"use client"
import React from "react";
import { Skeleton } from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="flex flex-none flex-col bg-white dark:bg-[#131313] w-[300px] p-6">
      <div className="flex flex-col gap-2">
        <Skeleton
          isLoaded={false}
          className="w-full bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
        <Skeleton
          isLoaded={false}
          className="w-2/3 bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
        <Skeleton
          isLoaded={false}
          className="w-full bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
      </div>
      <div className="flex flex-col gap-2 mt-10">
        <Skeleton
          isLoaded={false}
          className="w-full bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
        <Skeleton
          isLoaded={false}
          className="w-2/3 bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
        <Skeleton
          isLoaded={false}
          className="w-full bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
      </div>
      <div className="flex flex-col gap-2 mt-10">
        <Skeleton
          isLoaded={false}
          className="w-full bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
        <Skeleton
          isLoaded={false}
          className="w-2/3 bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
        <Skeleton
          isLoaded={false}
          className="w-full bg-gray-300 dark:bg-slate-900 rounded-full h-6"
        />
      </div>
    </div>
  );
};

export default Loader;
