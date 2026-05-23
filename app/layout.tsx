import type { Metadata } from "next";
import "./globals.css";
import PreloaderWrapper from "./components/wrapper/PreloaderWrapper";
import SmoothScroll from "./components/SmoothScroll";

export const metadata: Metadata = {
  title: "Farouk.Studio",
  description: "Farouk Ben Said Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PreloaderWrapper>
          <SmoothScroll>{children}</SmoothScroll>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
