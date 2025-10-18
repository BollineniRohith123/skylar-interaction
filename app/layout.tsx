import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skylar Voice Assistant",
  description: "Voice-powered assistant for Skylar - The House of Advertising.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-black text-white">
        <div className="flex mx-auto justify-between my-4 max-w-[1206px] px-4">
          <div className="text-3xl font-bold text-gradient-sky">
            Skylar Voice Assistant
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
