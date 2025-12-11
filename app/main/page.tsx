import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserToggle } from "@/components/UserToggle";

export default function MainPage() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-8 flex flex-col gap-10">
      <div className="flex justify-end gap-4">
        <UserToggle />
        <ThemeToggle />
      </div>

      <section className="space-y-4">
        <p className="text-lg font-semibold">WebIC Main Playground</p>
        <p className="text-text-secondary max-w-3xl">
          이 페이지는 로그인 후 사용자에게 보여줄 메인 화면입니다. 필요하다면 여기에
          작업 공간, 알림, 최근 활동 내역 등을 추가하세요.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-medium">
        <Link
          href="/ide/room-a"
          className="rounded-xl border border-border-light bg-bg-raised p-6 text-center hover:border-text-primary"
        >
          IDE Room A
        </Link>
        <Link
          href="/ide/room-b"
          className="rounded-xl border border-border-light bg-bg-raised p-6 text-center hover:border-text-primary"
        >
          IDE Room B
        </Link>
      </section>
    </main>
  );
}
