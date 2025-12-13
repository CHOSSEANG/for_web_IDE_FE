import FindPasswordPanel from "../../find-password/FindPasswordPanel";

export default function FindPasswordModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10">
      <div className="w-full max-w-md">
        <FindPasswordPanel />
      </div>
    </div>
  );
}
