"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#F7F5F0",
            border: "none",
            fontFamily: "var(--font-dm-sans)",
            fontSize: "14px",
          },
        }}
      />
    </SessionProvider>
  );
}
