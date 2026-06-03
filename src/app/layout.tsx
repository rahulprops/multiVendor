import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: "MulitVendor",
  description: "E-Commarce website muticart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      
    >
      <body>{children}</body>
    </html>
  );
}
