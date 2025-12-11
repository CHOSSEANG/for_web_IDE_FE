import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IdeRoomPage(props: any) {
  const { params } = props as { params: { id: string } };
  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-8">
      <header className="flex justify-between mb-6">
        <div>
          <p className="text-xs text-text-secondary">IDE Room ID</p>
          <p className="text-2xl font-semibold">{params.id}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-lg border border-border-light bg-bg-raised"
        >
          메인으로 돌아가기
        </Link>
      </header>

      <section className="rounded-2xl border border-border-light bg-white/60 p-6 shadow-sm">
        <p className="text-text-secondary">
          여기에 실제 IDE 뷰를 연결하면 됩니다. Liveblocks나 Monaco 에디터를 렌더하도록
          고도화하면 공유 실시간 편집도 가능해집니다.
        </p>
      </section>
    </div>
  );
}
