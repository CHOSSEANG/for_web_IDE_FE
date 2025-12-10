"use client";

import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { UserRound, LogIn } from "lucide-react";

export function UserToggle() {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <a href="/sign-in">
          <LogIn className="w-6 h-6 cursor-pointer" />
        </a>
      </SignedOut>

      <SignedIn>
        <a href="/user-profile">
          <UserRound className="w-6 h-6 cursor-pointer" />
        </a>
      </SignedIn>
    </div>
  );
}
// export function UserToggle() {
//   return (
//     <div className="fixed top-4 right-4 z-50">
//       <SignedOut>
//   <a href="/sign-in" className="transition">
//     <LogIn className="w-6 h-6 text-text-primary hover:text-[var(--icon-hover-light)] dark:hover:text-[var(--icon-hover-dark)]" />
//   </a>
// </SignedOut>


//       {/* 기본 로그인 상태 
//       <SignedIn>
//         <UserButton afterSignOutUrl="/sign-in" />
//       </SignedIn> */}

//       {/* 아이콘 커스텀 - 아이콘은 뜨지만 누르면 이슈오류 있음. 버전 업데이트 v5이후 다른 소스 써야함
//       <SignedIn>
//         <button
//           onClick={() => openUserProfile()}  // ← Clerk User 메뉴 열기
//           className="text-text-primary hover:text-text-muted transition"
//         >
//           <UserRound className="w-6 h-6" />
//         </button>
//       </SignedIn>*/}

//       {/* 로그인 상태 → 우리가 만든 아이콘을 UserButton 트리거로 사용 */}
//       <SignedIn>
//         <UserButton
//           appearance={{
//             elements: {
//               avatarBox: "hidden",       // 기본 아바타 숨기기
//               userButtonTrigger: "p-0 m-0", // 감싸는 요소 여백 제거
//             },
//             userProfile: {
//               variables: {
//                 colorPrimary: "#4E5FFF",
//               },
//             },
//           }}
//           userProfileMode="modal"  // 클릭하면 Clerk 모달 열림
//         >
//           <UserRound className="w-6 h-6 cursor-pointer text-text-primary hover:text-text-muted transition" />
//         </UserButton>
//       </SignedIn>
//     </div>
//   );
// }
