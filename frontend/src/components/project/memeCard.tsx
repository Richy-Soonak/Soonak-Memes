import React from "react";
import ImageWithFallback from "../share/ImageWithFallback";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";

interface IProps {
  number: number;
  pageName: string;
  image: string;
  description?: string;
  url?: string;
}

const MemeCard: React.FC<IProps> = ({
  number,
  pageName,
  image,
  description,
  url,
}) => {
  const router = useRouter();
  return (
    <div className="rounded-xl w-full bg-gradient-to-b from-[#3E8ED4] to-[#CE1328] p-[1px]">
      {pageName === "project" && (
        <div className="flex flex-col w-full h-full bg-white dark:bg-black rounded-xl p-4 pt-8">
          <div className="relative flex items-end">
            <div className="relative bg-[#142E48] w-1/4 rounded-tl-xl rounded-tr-[15%] aspect-[7_4] p-2 flex item-center justify-center text-white text-xl font-bold">
              <span className="z-20">{number}</span>
              <div className="absolute w-full h-[90%] left-[20%] -bottom-[1px] flex flex-wrap">
                <div className="trapezoid rounded-tl-xl bg-[#142E48] w-full h-full aspect-square"></div>
              </div>
            </div>
            <div className="flex gap-2 absolute right-2 top-1/2 -translate-y-1/2 justify-between items-center">
              232{" "}
              <Icon icon="fluent-emoji-flat:red-heart" className="text-3xl" />
            </div>
          </div>
          <div className="w-full aspect-square relative overflow-hidden rounded-xl rounded-tl-none flex items-center cursor-pointer card-image-wrapper">
            <ImageWithFallback
              fallbackSrc="/images/gallery.png"
              src={image}
              className="w-full card-image rounded-tl-none"
              alt="aaa"
            />
          </div>
          <div className="flex justify-center gap-1 mt-2">
            <div className="bg-[#D8E8F6] rounded-full px-3 py-2 hover:opacity-60 cursor-pointer">
              <Icon
                icon="fa-solid:thumbs-up"
                className="text-lg text-[#2196F3]"
              />
            </div>
            <div className="bg-[#D8E8F6] rounded-full px-3 py-2 hover:opacity-60 cursor-pointer">
              <Icon
                icon="fa-regular:thumbs-up"
                className="text-lg text-[#2196F3]"
                hFlip={true}
                vFlip={true}
              />
            </div>
          </div>
        </div>
      )}
      {pageName === "submission" && (
        <div className="flex flex-col w-full h-full bg-white dark:bg-black rounded-xl p-4 pt-8">
          <div className="relative flex items-end">
            <div className="relative bg-[#142E48] w-1/4 rounded-tl-xl rounded-tr-[15%] aspect-[7_4] p-2 flex item-center justify-center text-white text-xl font-bold">
              <span className="z-20">{number}</span>
              <div className="absolute w-full h-[90%] left-[20%] -bottom-[1px] flex flex-wrap">
                <div className="trapezoid rounded-tl-xl bg-[#142E48] w-full h-full aspect-square"></div>
              </div>
            </div>
            <div className="flex gap-2 absolute right-2 top-1/2 -translate-y-1/2 justify-between items-center"></div>
          </div>
          <div
            className="w-full aspect-square relative overflow-hidden rounded-xl rounded-tl-none flex justify-center items-center cursor-pointer card-image-wrapper"
            onClick={() => window.open(url, "_blank")}
          >
            <ImageWithFallback
              fallbackSrc="/images/gallery.png"
              src={image}
              className="w-auto h-auto max-w-full max-h-full object-contain card-image rounded-tl-none"
              alt="aaa"
            />
          </div>
          <center>{description}</center>
        </div>
      )}
    </div>
  );
};

export default MemeCard;
