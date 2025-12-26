import { clerkClient, verifyToken } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: Request) {
  const authorization = req.headers.get("authorization") ?? "";
  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch?.[1]?.trim() ?? "";

  if (!token) {
    return NextResponse.json(
      { message: "Authorization header를 확인해 주세요." },
      { status: 401 }
    );
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { message: "서버 설정이 올바르지 않습니다." },
      { status: 500 }
    );
  }

  let verified;
  try {
    verified = await verifyToken(token, { secretKey });
  } catch (error) {
    console.error("Token verification failed", error);
    return NextResponse.json(
      { message: "토큰이 유효하지 않습니다." },
      { status: 401 }
    );
  }

  const userId = verified.sub;
  if (!userId) {
    return NextResponse.json(
      { message: "사용자 정보를 찾을 수 없습니다." },
      { status: 401 }
    );
  }

  let body: ChangePasswordBody;
  try {
    body = (await req.json()) as ChangePasswordBody;
  } catch (error) {
    console.error("Failed to parse change password request", error);
    return NextResponse.json(
      { message: "요청을 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "현재 비밀번호와 새 비밀번호를 모두 입력해 주세요." },
      { status: 400 }
    );
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      {
        message: `새 비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`,
      },
      { status: 400 }
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user.passwordEnabled) {
    return NextResponse.json(
      { message: "비밀번호 변경이 불가능한 계정입니다." },
      { status: 400 }
    );
  }

  try {
    await client.users.verifyPassword({
      userId,
      password: currentPassword,
    });
  } catch (error) {
    console.error("Password verification failed", error);
    return NextResponse.json(
      { message: "현재 비밀번호가 일치하지 않습니다." },
      { status: 403 }
    );
  }

  try {
    await client.users.updateUser(userId, {
      password: newPassword,
    });
  } catch (error) {
    console.error("Failed to update password", error);
    return NextResponse.json(
      { message: "비밀번호 변경에 실패했습니다. 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
