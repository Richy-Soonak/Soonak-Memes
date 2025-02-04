"use client";
import Image from "next/image";
import React from "react";
import { Button, Input, SharedSelection } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import TrollBox from "@/components/trollBox";
import Exchange from "@/components/exchange";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const Funding: React.FC = () => {
  const [selectedKeys] = React.useState(new Set(["text"]));
  const [donateToken, setDonateToken] = React.useState<string>("USDC");

  const setTokenType = (keys: SharedSelection) => {
    console.log(keys.currentKey);
    setDonateToken(keys.currentKey ?? "");
  };

  return (
    <div className="w-full flex flex-col lg:flex-row w1400:gap-8 lg:gap-4 h-full rounded-md dark:bg-[#131313] bg-[#F2F5FF] border border-[#E1E1E1] dark:border-white/0 p-2 sm:p-6">
      <div className="w-full flex-none flex flex-col gap-3 w1200:w-2/3 lg:w-1/2">
        <div className="relative rounded-lg">
          <Image
            src="/funding-header.svg"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full"
            alt="header"
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
        <div className="rounded-xl w-full bg-gradient-to-br from-[#3E8ED4] via-[#CE1328] to-[#BC8C5B] p-[1px]">
          <div className="w-full h-full bg-white dark:bg-black rounded-xl p-4">
            <div className="flex justify-between px-4 gap-6 py-2">
              <div>
                <div className="items-center inline-flex">
                  TOKEN <Icon icon="mynaui:arrow-right" />
                </div>{" "}
                SOONAK
              </div>
              <span className="text-[#3E8ED4] break-all">
                H218TQViAXsSqwCLnf7L41zewUTRmdN1r4neLtjBXYXS
              </span>
            </div>
            <div className="h-[1px] w-full bg-[#ada7a0] my-2"></div>
            <div className="flex justify-between items-center px-4 gap-6">
              <div>
                <div className="items-center inline-flex">
                  END DATE <Icon icon="mynaui:arrow-right" />
                </div>{" "}
                05 Nov, 2024
              </div>
              <div>
                <Button
                  color="primary"
                  className="ml-1"
                  onClick={() =>
                    window.open("https://raydium.io/swap/", "_blank")
                  }
                >
                  View on DEX
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  className="ml-1 mt-1"
                  onClick={() =>
                    window.open("https://www.coingecko.com/", "_blank")
                  }
                >
                  View on GECKO
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-5 items-center dark:bg-black rounded-xl p-4 py-8">
          <h1 className="sm:text-7xl text-5xl font-semibold flex justify-center items-center gap-6">
            <Icon icon="fa:dollar" className="flex-none" /> 47.00
            <Image
              src="/images/sofar.svg"
              width={80}
              height={80}
              alt="header"
            />
          </h1>

          <div className="w-full sm:w-2/3 rounded-full bg-[#D9D9D9]">
            <div className="rounded-full w-[60%] p-2 text-right bg-gradient-to-r from-[#ffffff] to-[#3E8ED4]">
              50
            </div>
          </div>
          <div className="w-full flex justify-between sm:w-2/3 rounded-full bg-[#3E8ED4] p-1 px-3 text-medium cursor-pointer">
            <span>Donate Now</span>
            <div className="flex items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <div className="flex items-center gap-1">
                    <span>{donateToken}</span>
                    <Icon icon="icon-park-outline:down" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setTokenType}
                >
                  <DropdownItem key="SOL">SOL</DropdownItem>
                  <DropdownItem key="USDC">USDC</DropdownItem>
                  <DropdownItem key="SOONAK">SOONAK</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <div className="bg-[#F3F0F0] rounded-lg flex gap-2 p-3">
            <div className="bg-[#383D38] rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
              <Icon icon="prime:twitter" className="text-xl" />
            </div>
            <div className="bg-[#007EBB] rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
              <Icon icon="ri:linkedin-fill" className="text-xl" />
            </div>
            <div className="bg-[#1877F2] rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
              <Icon icon="mage:facebook" className="text-xl" />
            </div>
            <div className="bg-white rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
              <Icon icon="logos:google-gmail" className="text-medium" />
            </div>
          </div>

          <div className="bg-[#3e8ed421] p-5 rounded-xl sm:w-4/5 w-full text-center text-medium">
            LET ME HAVE THE SENTENCE THAT WILL BE HERE.... LET ME HAVE THE
            SENTENCE THAT WILL BE HERE.... LET ME HAVE THE SENTENCE THAT WILL BE
            HERE.... LET ME HAVE THE SENTENCE THAT WILL BE HERE.... LET ME HAVE
            THE SENTENCE THAT WILL BE HERE.... LET ME HAVE THE SENTENCE THAT
            WILL BE HERE.... LET ME HAVE THE SENTENCE THAT WILL BE HERE.... LET
            ME HAVE THE SENTENCE THAT WILL BE HERE.... LET ME HAVE THE SENTENCE
            THAT WILL BE HERE.... LET ME HAVE THE SENTENCE THAT WILL BE HERE....
          </div>
        </div>
      </div>
      <div className="grow">
        <Exchange />
        <TrollBox />
      </div>
    </div>
  );
};

export default Funding;
