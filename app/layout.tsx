import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ThemeProvider } from "./providers/theme-provider";

const ROUTE_TITLE: Record<string, string> = {
  "/": "welcome",
  "/sign-in": "sign in",
  "/sign-up": "sign up",
  "/welcome": "welcome",
  "/dev-preview": "dev preview",
  "/preview": "preview",
  "/404": "404",
  "/ide": "ide",
  "/settings": "settings",
  "/profile": "profile",
};

export async function generateMetadata({
  pathname,
}: {
  pathname: string;
}) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const label =
    ROUTE_TITLE[normalized] ??
    normalized.split("/").filter(Boolean).slice(-1)[0] ??
    "home";
  return {
    title: `WEBIC - ${label}`,
  };
}

// Clerk의 버튼/유저메뉴 기능이 필요하다면 아래 import 사용 가능
// import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ko" suppressHydrationWarning>
        <head>
          {/* 유리 커스텀 테마 초기화 스크립트 그대로 유지 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem("theme");
                    if (theme === "dark") {
                      document.documentElement.classList.add("dark");
                    } else if (theme === "light") {
                      document.documentElement.classList.remove("dark");
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>

        <body>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
