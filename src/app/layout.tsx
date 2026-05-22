import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Developer Roadmaps — Your Path to Success",
    template: "%s | Developer Roadmaps",
  },
  description:
    "Interactive, step-by-step developer roadmaps with progress tracking, topic-locked quizzes, and curated LeetCode problems. Learn frontend, backend, full-stack, JavaScript, and DSA the right way.",
  applicationName: "Developer Roadmaps",
  keywords: [
    "developer roadmap",
    "frontend roadmap",
    "backend roadmap",
    "full-stack roadmap",
    "javascript roadmap",
    "dsa roadmap",
    "learning path",
    "coding interview prep",
    "leetcode problems",
    "programming quizzes",
    "web development",
    "computer science",
  ],
  authors: [{ name: "Developer Roadmaps" }],
  creator: "Developer Roadmaps",
  publisher: "Developer Roadmaps",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Developer Roadmaps",
    title: "Developer Roadmaps — Your Path to Success",
    description:
      "Curated roadmaps, progress tracking, and quizzes to help you become a better developer.",
    url: siteUrl,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Developer Roadmaps — Interactive learning paths for developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Roadmaps — Your Path to Success",
    description:
      "Curated roadmaps, progress tracking, and quizzes to help you become a better developer.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/easyroadmap_logo.svg", type: "image/svg+xml" }],
    shortcut: "/easyroadmap_logo.svg",
    apple: "/easyroadmap_logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeInitScript = `
    (function() {
      try {
        var t = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (t === 'dark' || (!t && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
