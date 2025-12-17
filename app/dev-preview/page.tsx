import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserToggle } from "@/components/UserToggle";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center flex-col gap-6">
      
      {/* 오른쪽 상단에 임시고정  */}
      <div className="fixed top-4 right-12">
              <UserToggle />
              <ThemeToggle />
      </div>

      {/* WebIC 컬러 시스템 확인용 박스 */}
      <div className="p-10 rounded-xl bg-bg-raised border border-border-light shadow-lg">
        <h1 className="text-2xl font-semibold">dev - WebIC Color Test</h1>
        <p className="text-text-secondary mt-2">
          Tailwind + CSS Variables + ThemeProvider 정상 적용됨! <br />
          12/10 유리! #개발자들 보는 메인페이지에용.. <br />나중에 메인 만들면 이페이지 사라질까봐 따로 뽑아용
        </p>
      </div>

      {/* 버튼 프리뷰 */}
      <div className="flex flex-col gap-4 p-6"> 
        <Link
          href="/"
          className="px-5 py-3 bg-warning rounded-lg bg-primary text-primary-foreground text-center font-medium hover:opacity-90 transition"
        >
          메인 (이페이지) 바로가기
        </Link>

        <Link
          href="/welcome"
          className="px-5 py-3 rounded-lg bg-primary/80 bg-blue-600 hover:bg-blue-500 text-primary-foreground text-center hover:bg-primary transition font-medium"
        >
          WebIC 첫방문자 페이지
        </Link>

        <Link
          href="/dev-preview"
          className="px-5 py-3 rounded-lg bg-bg-raised border border-border-light text-center hover:bg-bg-hover transition"
        >
          개발 프리뷰 바로가기
        </Link>

        <Link
          href="/preview"
          className="px-5 py-3 rounded-lg bg-bg-raised border border-border-light text-center hover:bg-bg-hover/100 transition"
        >
          버튼 프리뷰 바로가기
        </Link>

        <Link
          href="/404"
          className="px-5 py-3 rounded-lg bg-red-500/80 text-white text-center hover:bg-red-600 transition font-medium"
        >
          404 페이지
        </Link>
      </div>


      <div>
        

      </div>
    </main>
  );
}
