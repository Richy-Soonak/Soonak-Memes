import React from "react";
import ImageWithFallback from "../share/ImageWithFallback";

const ChatBox: React.FC = () => {
  return (
    <div className="w-full flex bg-[#F3F3F3] dark:bg-black border border-[#3E8ED4] rounded-[38px] p-1">
      <div className="flex-none">
        <ImageWithFallback
          src="/images/messi.png"
          width={70}
          height={70}
          className="aspect-square rounded-full flex-none"
          alt="header"
        />
      </div>
      <div className="p-2 py-1">
        <span className="text-[#3E8ED4] text-sm">CRYPTOSI</span>
        <p className="text-xs text-ellipsis break-all overflow-hidden">
          LET ME HAVE THE SENTENCE THAT WILL
        </p>
        <p className="text-right text-[#3E8ED4] text-sm">Today at 6:37 AM</p>
      </div>
    </div>
  );
};

export default ChatBox;
