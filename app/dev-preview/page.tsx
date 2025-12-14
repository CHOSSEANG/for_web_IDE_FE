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
      <div>
        <p className="p-2">
          <Link href="/">메인 바로가기</Link>
        </p>
        <p className="p-2">
          <Link href="/preview">버튼 프리뷰 바로가기</Link>
        </p>
        <p className="p-2">
          <Link href="/dev-preview">개발 프리뷰 바로가기</Link>
        </p>
        <p className="p-2">
          <Link href="/welcome">webic 첫방문자 노출 페이지</Link>
        </p>
        <p className="p-2">
          <Link href="/404">404 페이지</Link>
        </p>
      </div>


      <div>
        

      </div>
    </main>
  );
}
