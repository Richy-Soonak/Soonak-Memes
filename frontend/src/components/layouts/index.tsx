import React from "react";
import dynamic from "next/dynamic";
import HeaderLoader from "@/components/layouts/header/loader";
import SiderLoader from "@/components/layouts/sider/loader";

const Header = dynamic(() => import("@/components/layouts/header"), {
  ssr: false,
  loading: () => <HeaderLoader />,
});
const Sider = dynamic(() => import("@/components/layouts/sider"), {
  ssr: false,
  loading: () => <SiderLoader />,
});

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex w-full min-h-[100vh] bg-[#F7F7F7]">
      <Sider />
      <div className="flex grow md:ml-[300px] transition-all duration-75">
        <div className="w-full h-full flex flex-col">
          <Header />
          <div className="bg-[#F7F7F7] dark:bg-black p-2 sm:p-5 w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
