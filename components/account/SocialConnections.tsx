export default function SocialConnections() {
  const providers = [
    { name: "Google", connected: true },
    { name: "GitHub", connected: true },
    { name: "Kakao", connected: false },
    { name: "Naver", connected: false },
    { name: "Apple", connected: false },
    { name: "Discord", connected: false },
  ];

  return (
    <div className="bg-[#2A3142] rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">소셜 로그인 연결</h2>

      <ul className="space-y-4">
        {providers.map((provider, idx) => (
          <li
            key={idx}
            className="flex justify-between border-b border-white/5 pb-4 last:border-none"
          >
            <span>{provider.name}</span>

            {provider.connected ? (
              <span className="text-sm text-green-400">연결됨</span>
            ) : (
              <button className="text-sm rounded-lg bg-indigo-500 px-3 py-1 hover:bg-indigo-600">
                연결하기
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
