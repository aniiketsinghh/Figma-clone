import React from "react";
import "./globals.css";
import Room from "./Room";
import { TooltipProvider } from "@/components/ui/tooltip"; // keep it if your tooltip component exists

// React does NOT support metadata or next/font
// So we load Google font using <link> instead

const RootLayout = ({ children }) => {
  return (
    <>
      {/* Google Work Sans Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="bg-primary-grey-200 font-sans">
        <Room>
          <TooltipProvider>{children}</TooltipProvider>
        </Room>
      </div>
    </>
  );
};

export default RootLayout;
