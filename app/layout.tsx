import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./providers/theme-provider";

// Clerk의 버튼/유저메뉴 기능이 필요하다면 아래 import 사용 가능
// import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function RootLayout({ children }) {
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
            {/* 여기서 전역 헤더/네비 필요하면 넣기 가능 */}
            {/* 
            <header className="flex justify-end p-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            */}

            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
