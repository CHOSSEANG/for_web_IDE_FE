// 빌드-배포 505 오류 이슈로 파일명을 middleware.ts 에서 middleware.off.ts 로 변경하였습니다.  (12/13 madelily)
// 화면전환을 위해 미들웨어 파일명 복구후, 코드 변경 (12/15 madelily)
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();  //clerk v6.x 에서 호출금지 오류가 있음. 
  const { pathname } = req.nextUrl;

  // 루트 접속 분기
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(userId ? "/main" : "/welcome", req.url)
    );
  }

  // 로그인 안 된 상태에서 /main 접근 → welcome
  if (!userId && pathname.startsWith("/main")) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  // 로그인 된 상태에서 /welcome 접근 → main
  if (userId && pathname === "/welcome") {
    return NextResponse.redirect(new URL("/main", req.url));
  }

  return NextResponse.next();
});
export const config = {
  matcher: ["/", "/welcome", "/main/:path*"],
};
