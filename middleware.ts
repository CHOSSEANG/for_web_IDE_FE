import { clerkMiddleware } from "@clerk/nextjs/server";

 export default clerkMiddleware();

export const config = {
  matcher: [
    // 인증을 검사할 경로만 지정
    "/((?!_next|static|favicon.ico|logo|icons|sign-in|sign-up|welcome|user-profile).*)",
  ],
};

