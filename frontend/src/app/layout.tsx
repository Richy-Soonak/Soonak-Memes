import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import Layout from "@/components/layouts";
import Provider from "@/providers";
import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "react-quill/dist/quill.snow.css";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "meme wars",
  description: "soonak meme wars on solana",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.png",
        href: "/favicon.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.png",
        href: "/favicon.png",
      },
    ],
  },
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning={true}>
//       <head></head>
//       <body className={inter.className} suppressHydrationWarning={true}>
//         <Provider>
//           <Layout>{children}</Layout>
//         </Provider>
//       </body>
//     </html>
//   );
// }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head></head>
      <body suppressHydrationWarning={true}>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
}
