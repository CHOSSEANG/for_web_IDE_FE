import Link from "next/link";

export default function PreviewUserPage() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">User Preview</h1>
        <Link
          href="/preview"
          className="text-sm text-blue-500 underline"
        >
          버튼 프리뷰로 돌아가기
        </Link>
      </div>

      <section className="rounded-xl border border-border-light bg-white/70 p-6 shadow-sm">
        <p className="text-text-secondary">
          이 영역에 Clerk의 `UserButton`이나 `UserProfile` 컴포넌트를 옮겨와서
          사용자 프로필 UI를 확인할 수 있습니다.
        </p>
      </section>
    </main>
  );
}
