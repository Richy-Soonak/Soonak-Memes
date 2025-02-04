"use client";
import ProjectCard from "@/components/dashboard/card";
import Image from "next/image";
import { useAtom } from "jotai";
import { projectsAtom } from "@/store/meme";
import { useEffect } from "react";

export default function Home() {
  const [projectlists, setProjects] = useAtom(projectsAtom);
  return (
    <div className="w-full h-full grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w1700:grid-cols-5 gap-4 p-2 sm:p-5 rounded-md dark:bg-[#131313] bg-[#F2F5FF] border border-[#E1E1E1] dark:border-white/0">
      {projectlists.map((c, index) => (
        <ProjectCard key={index} project={c} />
      ))}
    </div>
  );
}
