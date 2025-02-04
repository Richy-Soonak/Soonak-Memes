"use client";
import Image from "next/image";
import React from "react";
import { Button, Input, SharedSelection } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import TrollBox from "@/components/trollBox";
import { useRouter } from "next/navigation";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import MemeCard from "@/components/project/memeCard";
import BorderGradient from "@/components/share/BorderGradient";
import ImageWithFallback from "@/components/share/ImageWithFallback";
import { useAtom } from "jotai";
import { projectsAtom } from "@/store";
import { useSearchParams } from "next/navigation";
import  type { Project } from "@/types";

const memes = [
  {
    src: "/images/meme1.png",
    usd: 120,
    soonak: 200,
    native: 400,
    place: "1st PLACE",
  },
  {
    src: "/images/meme2.png",
    usd: 120,
    soonak: 200,
    native: 400,
    place: "2nd PLACE",
  },
  {
    src: "/images/meme3.png",
    usd: 120,
    soonak: 200,
    native: 400,
    place: "3rd PLACE",
  },
];

const Project: React.FC = () => {
  //hooks
  const router = useRouter();
  // atoms
  const [projects] = useAtom(projectsAtom);
  const [project, setProject] = React.useState<Project | undefined>(undefined);
  // get id
  const searchParams = useSearchParams();
  searchParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  const id = searchParams.get("id");

  const [selectedKeys] = React.useState(new Set(["text"]));
  const [sortBy, setSortBy] = React.useState<string>("Ascending");

  const setSortType = (keys: SharedSelection) => {
    console.log(keys.currentKey);
    setSortBy(keys.currentKey ?? "");
  };

  React.useEffect(() => {
    console.log(id);
    const _project = projects.find((p: Project) => p.publicKey === id);
    setProject(_project);
  }, [id]);

  const _renderTopMeme = ({
    src,
    usd,
    soonak,
    native,
    place,
  }: {
    src: string;
    usd: number;
    soonak: number;
    native: number;
    place: string;
  }) => {
    return (
      <BorderGradient className="p-2 xs:p-3">
        <div className="flex gap-3 items-end w-full">
          <div className="w-1/3 aspect-[2.2/1] relative overflow-hidden rounded-lg flex items-center cursor-pointer card-image-wrapper">
            <ImageWithFallback
              fallbackSrc={src}
              src={src}
              className="w-full card-image rounded-lg"
              alt="aaa"
            />
          </div>
          <span className="text-2xl font-semibold">{place}</span>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 mt-2">
          <div className="bg-[#3e8ed43f] w-full rounded-full p-1 flex items-center gap-2">
            <Image
              src="/tokens/usdc.png"
              width={30}
              height={30}
              className="rounded-full"
              alt="project-header"
            />
            <span className="pr-2 text-sm break-all truncate">100 USDC</span>
          </div>
          <div className="bg-[#3e8ed43f] w-full rounded-full p-1 flex items-center gap-2">
            <Image
              src="/tokens/usdc.png"
              width={30}
              height={30}
              className="rounded-full"
              alt="project-header"
            />
            <span className="pr-2 text-sm break-all truncate">100 USDC</span>
          </div>
          <div className="bg-[#3e8ed43f] w-full rounded-full p-1 flex items-center gap-2">
            <Image
              src="/tokens/usdc.png"
              width={30}
              height={30}
              className="rounded-full"
              alt="project-header"
            />
            <span className="pr-2 text-sm break-all truncate">100 USDC</span>
          </div>
        </div>
      </BorderGradient>
    );
  };

  return (
    <div className="w-full flex flex-col lg:flex-row w1400:gap-8 lg:gap-4 h-full rounded-md dark:bg-[#131313] bg-[#F2F5FF] border border-[#E1E1E1] dark:border-white/0 p-2 sm:p-6">
      <div className="w-full flex-none flex flex-col gap-3 w1200:w-2/3 lg:w-1/2">
        <div className="relative rounded-lg">
          <Image
            src="/project-header.svg"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full"
            alt="project-header"
          />
          <Image
            src="/images/gold.png"
            width={0}
            height={0}
            sizes="100vw"
            className="absolute w-1/2 top-0 right-0"
            alt="header"
          />
        </div>
        <div className="flex justify-end">
          <div className="flex justify-between border border-[#ffffff3b] rounded-full text-xs">
            <span className="p-2 pl-3">Sort by {sortBy}</span>
            <Dropdown>
              <DropdownTrigger>
                <div className="border border-[#ffffff3b] rounded-full w-8 h-8 flex justify-center items-center cursor-pointer hover:opacity-60">
                  <Icon icon="mingcute:down-line" className="text-2xl" />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={setSortType}
              >
                <DropdownItem key="Ascending">Ascending</DropdownItem>
                <DropdownItem key="Descending">Descending</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="grid xs:grid-cols-2 lg:grid-cols-1 w1200:grid-cols-2 w1400:grid-cols-3 gap-2">
          {project?.memes.length === 0 ? (
            <div>There is no meme yet</div>
          ) : (
            project?.memes.map((item, index) => (
              <MemeCard
                key={"project_card_" + index}
                number={index + 1}
                pageName="project"
                image={item.image}
              />
            ))
          )}
        </div>
      </div>
      <div className="grow flex flex-col gap-2">
        <BorderGradient className="!bg-[#142E48] flex gap-2 items-center justify-center py-5 px-8">
          <Button
            color="primary"
            variant="bordered"
            className="w-full"
            size="lg"
            onClick={() => router.push(`/submission?id=${id}`)}
          >
            Enter
          </Button>
          <Button color="primary" className="w-full" size="lg">
            Donate
          </Button>
        </BorderGradient>

        <BorderGradient className="py-5 px-6">
          <h2 className="px-2">Price Pool</h2>
          <div className="flex flex-col xs:flex-row gap-2 items-center mt-1">
            <div className="bg-[#3e8ed43f] w-full rounded-full p-1 flex items-center gap-2">
              <Image
                src="/tokens/usdc.png"
                width={35}
                height={35}
                className="rounded-full"
                alt="project-header"
              />
              <span className="pr-2 break-all truncate">100 USDC</span>
            </div>
            <Icon
              icon="icon-park-solid:add-one"
              className="text-3xl text-blue-500 flex-none"
            />
            <div className="bg-[#3e8ed43f] w-full rounded-full p-1 flex items-center gap-2">
              <Image
                src="/tokens/soonak.png"
                width={35}
                height={35}
                className="rounded-full"
                alt="project-header"
              />
              <span className="pr-2 break-all truncate">5000 SOONAK</span>
            </div>
          </div>
        </BorderGradient>

        <div className="w-full flex flex-col gap-2 bg-white dark:bg-black p-4 rounded-lg mt-3">
          {memes.map((m) => _renderTopMeme(m))}
        </div>

        <BorderGradient className="!bg-[#142E48] flex flex-col items-center justify-center p-4">
          <div className="text-white text-lg">You Must Hold 1000 Native</div>
          <span>
            <svg
              width="33"
              height="35"
              viewBox="0 0 33 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.4336 27.2312C32.1365 26.5299 31.7189 25.7364 31.1921 24.872C30.662 24.0042 30.0508 23.1746 29.3766 22.407C29.04 22.0232 28.6922 21.6821 28.3343 21.385C29.5083 20.9764 30.4436 20.4069 31.1246 19.6854C32.0768 18.6769 32.5586 17.3295 32.5586 15.6783C32.5586 14.8769 32.419 14.1059 32.1421 13.3856C31.8618 12.6573 31.4454 12.009 30.9051 11.4586C30.3682 10.9116 29.7424 10.485 29.0434 10.1901C28.4705 9.93006 27.8233 9.7556 27.1198 9.67118C26.8215 9.63516 26.4951 9.60815 26.1428 9.58789L22.4904 13.8662H23.4347C25.1343 13.8662 25.7579 14.0226 25.9796 14.1161C26.3646 14.277 26.6538 14.51 26.8666 14.8274C27.0782 15.1459 27.1817 15.5084 27.1817 15.9372C27.1817 16.4842 27.0568 16.9052 26.8125 17.1877C26.5514 17.4883 26.1507 17.71 25.6206 17.8439C25.0128 17.9981 24.2406 18.0769 23.3255 18.0769H21.2973H20.8909H20.3428V17.0954V17.0538V16.3807L20.0895 16.6778L16.4022 20.9955L15.0188 22.6163L4.45312 34.9998L15.0188 25.1376V28.0315C15.0188 28.9916 15.2485 29.7491 15.7021 30.2837C16.1815 30.8488 16.849 31.1358 17.6876 31.1358C18.4687 31.1358 19.1159 30.8656 19.6123 30.3332C20.0963 29.8132 20.3428 29.0388 20.3428 28.0315V22.8775V22.2562H21.1194C21.1712 22.2562 21.2218 22.2562 21.2714 22.2584C21.8353 22.2697 22.3035 22.3485 22.6648 22.4948C23.0419 22.6479 23.4313 22.9484 23.8208 23.3885C24.2496 23.8725 24.7505 24.5996 25.311 25.5552L26.9319 28.2509C27.3247 28.9049 27.6275 29.3878 27.8571 29.7254C28.1227 30.116 28.4469 30.4447 28.8183 30.7024C29.2348 30.9894 29.7424 31.1358 30.3266 31.1358C30.8083 31.1358 31.2462 31.0356 31.6266 30.8397C32.016 30.6394 32.3289 30.3591 32.5586 30.0068C32.7938 29.6433 32.9131 29.2628 32.9131 28.8756C32.9131 28.6381 32.858 28.2363 32.4336 27.2312Z"
                fill="#3E8ED4"
              />
              <path
                d="M5.99478 22.956C7.06744 23.3927 8.26505 23.6538 9.56733 23.7326C9.57746 23.7337 9.58646 23.7337 9.5966 23.7337L11.0733 22.0037L14.2812 18.2623L20.7082 10.7357L21.4139 9.9095L29.8748 0L29.8141 0.0562784L20.3368 8.90212C20.3008 8.77155 20.2625 8.64324 20.222 8.51605C20.0565 7.99716 19.8573 7.50191 19.6254 7.03143C18.8082 5.37346 17.587 4.07681 15.9966 3.17635C14.4208 2.2849 12.5219 1.83355 10.3496 1.83355C8.75017 1.83355 7.29593 2.08906 6.02742 2.59331C4.7454 3.10319 3.64121 3.8517 2.74526 4.81631C1.85269 5.77642 1.16271 6.95264 0.695602 8.3112C0.234119 9.65287 0 11.1431 0 12.7414C0 14.3003 0.223989 15.7737 0.665211 17.1221C1.11319 18.4908 1.7874 19.6806 2.66985 20.6598C3.5568 21.6447 4.67572 22.4168 5.99478 22.956ZM5.77642 9.89037C6.0353 9.07321 6.38873 8.39787 6.82545 7.88573C7.25541 7.38035 7.7743 6.99091 8.3686 6.72752C8.96853 6.46076 9.63486 6.32569 10.3496 6.32569C11.357 6.32569 12.2574 6.56994 13.0262 7.05169C13.7995 7.53681 14.3803 8.23916 14.8035 9.19927C15.104 9.88024 15.3021 10.6614 15.3944 11.5292C15.436 11.9164 15.4574 12.3205 15.4574 12.7414C15.4574 12.8168 15.4563 12.8911 15.4552 12.9654C15.4518 13.1388 15.4462 13.3098 15.436 13.4764C15.4113 13.9064 15.364 14.3139 15.2942 14.6977V14.6988C15.1772 15.3539 14.9959 15.9414 14.7506 16.4581C14.5007 16.9837 14.2035 17.4362 13.8602 17.811C13.5811 18.1205 13.2705 18.3772 12.9294 18.5798C12.3587 18.9208 11.7588 19.1324 11.1116 19.2191C10.882 19.2506 10.6456 19.2664 10.4036 19.2664C9.68889 19.2664 9.02706 19.1335 8.43613 18.8713C7.84971 18.6113 7.3207 18.2117 6.86259 17.6827C6.40111 17.1492 6.03642 16.4581 5.77754 15.6296C5.51191 14.7787 5.37797 13.8073 5.37797 12.7414C5.37797 11.6868 5.51202 10.7278 5.77642 9.89037Z"
                fill="#3E8ED4"
              />
            </svg>
          </span>
          <div className="text-white text-lg">1000 SOONAK To Post Here</div>
        </BorderGradient>

        <TrollBox className="mt-3" />
      </div>
    </div>
  );
};

export default Project;
