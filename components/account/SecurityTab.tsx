export default function SecurityTab() {
  const devices = [
    {
      type: "desktop",
      name: "MacBook · Chrome",
      lastActive: "2025.12.12",
      current: true,
    },
    {
      type: "mobile",
      name: "iPhone · Safari",
      lastActive: "2025.12.10",
      current: false,
    },
  ];

  return (
    <section className="space-y-8">

      <div className="bg-[#2A3142] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">로그인된 기기</h2>

        <ul className="space-y-4">
          {devices.map((device, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="text-2xl">
                {device.type === "desktop" ? "🖥" : "📱"}
              </span>
              <div>
                <p>{device.name}</p>
                <p className="text-sm text-gray-400">
                  마지막 로그인: {device.lastActive}
                  {device.current && " · 현재 기기"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#2A3142] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">2단계 인증</h2>
        <p className="text-sm text-gray-400 mb-4">
          로그인 시 추가 인증을 통해 계정 보안을 강화합니다.
        </p>
        <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600">
          2단계 인증 설정
        </button>
      </div>
    </section>
  );
}
