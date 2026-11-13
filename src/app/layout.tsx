import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Bharat Patel | Engineering Ideas, Building Solutions",
  description: "Bharat Patel is an Electronics and Computer Engineering student building practical software, AI and connected systems in Mumbai, India.",
  openGraph: {
    title: "Bharat Patel | Engineering Ideas, Building Solutions",
    description: "Projects, prototypes and field notes from an engineering student in Mumbai.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
