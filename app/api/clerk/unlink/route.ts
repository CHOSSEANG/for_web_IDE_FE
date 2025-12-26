import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type UnlinkBody = {
    provider?: string;
};

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { message: "로그인한 사용자만 외부 연결을 해제할 수 있습니다." },
            { status: 401 }
        );
    }

    let provider: string | undefined;
    try {
        const body = (await req.json()) as UnlinkBody;
        provider = body.provider;
    } catch (error) {
        // Keep the caught error visible for debugging while satisfying ESLint.
        console.error("Failed to parse unlink request", error);
        return NextResponse.json(
            { message: "요청 데이터를 읽을 수 없습니다." },
            { status: 400 }
        );
    }

    if (!provider) {
        return NextResponse.json(
            { message: "연결된 공급자 정보를 지정해야 합니다." },
            { status: 400 }
        );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const externalAccount = user.externalAccounts?.find(
        (account) => account.provider === provider
    );

    if (!externalAccount) {
        return NextResponse.json(
            { message: "해당 공급자와 연결된 계정을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    try {
        await client.users.deleteUserExternalAccount({
            userId,
            externalAccountId: externalAccount.id,
        });
    } catch (error) {
        console.error("Clerk unlink failed", error);
        return NextResponse.json(
            { message: "연결 해제 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}
