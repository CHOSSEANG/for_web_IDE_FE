import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserToggle } from "@/components/UserToggle";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center flex-col gap-6">

      {/* 오른쪽 상단에 고정 임시작업 */}
      <div className="fixed top-4 right-4">
        <UserToggle /> <ThemeToggle />
      </div>

      {/* WebIC 컬러 시스템 확인용 박스 */}
      <div className="p-10 rounded-xl bg-bg-raised border border-border-light shadow-lg">
        <h1 className="text-2xl font-semibold">main</h1>
        <p className="text-text-secondary mt-2">
          오마나.. 메인페이지 이야기를 한번도 안했네 ㅋㅋ <br /> 쌩초보방문자의 페이지  = 위빅, 웹잌 소개페이지 
        </p>
      </div>

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
          className="px-5 py-3 bg-success rounded-lg bg-bg-raised border border-border-light text-center hover:bg-bg-hover transition"
        >
          버튼 프리뷰 바로가기
        </Link>

        <Link
          href="/404"
          className="px-5 py-3 rounded-lg bg-red-500/80 text-white text-center hover:bg-red-500 transition font-medium"
        >
          404 페이지
        </Link>
      </div>
    </main>
  );
}
