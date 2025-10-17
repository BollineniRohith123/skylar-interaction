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
        <div className="flex mx-auto justify-between my-4 max-w-[1206px]">
          <div className="text-2xl font-bold">Skylar Voice Assistant</div>
          <a href="mailto:hello@fixie.ai?subject=Skylar%20Voice%20Assistant" >
            <button className="hover:bg-gray-700 px-6 py-2 border-2 rounded-[3px] w-40 mb-2">
              Get In Touch
            </button>
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}
