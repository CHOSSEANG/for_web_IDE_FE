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
    <div className="bg-[#2A3142] rounded-2xl p-4">
      <h2 className="text-base font-semibold mb-3">소셜 로그인 연결</h2>

      <ul
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          lg:grid-cols-3
          gap-2
        "
      >
        {providers.map((provider, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between rounded-lg bg-[#3A4152] px-3 py-2"
          >
            <span className="text-sm">{provider.name}</span>

            {provider.connected ? (
              <span className="text-xs text-green-400">연결됨</span>
            ) : (
              <button className="text-xs rounded-md bg-indigo-500 px-2 py-1 hover:bg-indigo-600">
                연결
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
