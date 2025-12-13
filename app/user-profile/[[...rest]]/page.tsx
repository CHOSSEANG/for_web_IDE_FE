import AccountContent from "@/components/account/AccountContent";
import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <main className="bg-[#0A0F1D] text-white flex justify-center ">
     
        <div className="flex flex-col items-center gap-6">

      <div className="w-full max-w-5xl px-4">
        <AccountContent />
      </div>



      {/* Clerk 로그인 박스 */}
              <UserProfile />
              </div>
           
    </main>
  );
}
