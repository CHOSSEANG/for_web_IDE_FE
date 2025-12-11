import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sun, Moon } from "lucide-react";
import { WebicTabs } from "@/components/ui/tabs";
import { UserToggle } from "@/components/UserToggle";



export default function ButtonPreviewPage() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-10">
      {/* 오른쪽 상단에 임시고정  */}
            <div className="fixed top-4 right-12">
                    <UserToggle />
                    <ThemeToggle />
            </div>

      
      <h1 className="text-3xl font-semibold mb-8">WebIC 버튼 프리뷰</h1>

      {/* 버튼 그룹 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="space-y-2">
          <Button>Primary</Button>
        </div>

        <div className="space-y-2">
          <Button variant="secondary">Secondary</Button>
        </div>

        <div className="space-y-2">
          <Button variant="outline">Outline</Button>
        </div>

        <div className="space-y-2">
          <Button variant="ghost">Ghost</Button>
        </div>

        <div className="space-y-2">
          <Button variant="destructive">Destructive</Button>
        </div>

        <div className="space-y-2">
          <Button variant="icon">★</Button>
          </div>

            <div className="space-y-2">
            <Button variant="icon">
              <Sun className="w-6 h-6" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button variant="icon">
              <Moon className="w-6 h-6" />
            </Button>
          </div>

          
        
      </div>
      

      <div className="mt-10 mb-10">
          <WebicTabs />
      </div>

      <div className="mt-20">
        <p className="p-1 border-red-50 bg-gray-200 mb-5"></p>
        <h2 className="mb-5">아래 링크를 선택하면 미리보기 화면으로 이동합니다. 백버튼 없으니 브라우저 뒤로가기로 돌아오세용~</h2>
        <p className="p-1 border-red-50 bg-gray-200 mb-5"></p>

        <p className="mb-5">
          <Link className="m-10" href="/preview/dropdown">
            dropdown menu
          </Link>
          <Link className="m-10" href="/preview/tabs">
            tabs
          </Link>
          <Link className="m-10" href="/preview/command">
            command
          </Link>
          <Link className="m-10" href="/preview/form">
            form
          </Link>
          <Link className="m-10" href="/preview/filetree">
            filetree
          </Link>
        </p>

        <p>
          <Link className="m-10" href="/preview/user">
            user page(작업예정)
          </Link>
        </p>
        <p className="p-1 border-red-50 bg-gray-200 mt-5 "></p>
      </div>
      <div className="mt-20">
        <Link href="/">↩︎ 메인 바로가기</Link>
      </div>
    </main>
  );
}
