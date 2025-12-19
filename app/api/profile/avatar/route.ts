import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type UploadBody = {
  fileName?: string;
  fileType?: string;
  data?: string;
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const extensionFromMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

const buildOrigin = (req: Request) => {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const hostHeader = forwardedHost ?? req.headers.get("host");
  const host = hostHeader ?? "localhost:3000";
  const protoHeader =
    req.headers.get("x-forwarded-proto") ?? "http";
  const protocol = protoHeader.split(",")[0].trim() || "http";
  return `${protocol}://${host}`;
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { message: "로그인한 사용자만 프로필 사진을 변경할 수 있습니다." },
      { status: 401 }
    );
  }

  let body: UploadBody;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Unable to parse profile image upload body", error);
    return NextResponse.json(
      { message: "요청 데이터를 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const { fileType, data } = body ?? {};
  if (!fileType || !fileType.startsWith("image/") || !data) {
    return NextResponse.json(
      { message: "올바른 이미지 파일을 전달해주세요." },
      { status: 400 }
    );
  }

  let imageBuffer: Buffer;
  try {
    imageBuffer = Buffer.from(data, "base64");
  } catch (error) {
    console.error("Failed to decode image buffer", error);
    return NextResponse.json(
      { message: "이미지 데이터를 처리할 수 없습니다." },
      { status: 400 }
    );
  }

  if (imageBuffer.length === 0 || imageBuffer.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { message: "허용되는 최대 이미지 용량을 초과했습니다." },
      { status: 413 }
    );
  }

  const extension =
    extensionFromMime[fileType] ?? fileType.split("/")[1] ?? "png";
  const fileName = `${userId}-${Date.now()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public/profile-images");
  const destinationPath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(destinationPath, imageBuffer);
  } catch (error) {
    console.error("Failed to write profile image", error);
    return NextResponse.json(
      { message: "이미지를 저장하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  const origin = buildOrigin(req);
  const imageUrl = `${origin}/profile-images/${fileName}`;

  try {
    const client = await clerkClient();
    // 아래는 빌드시 에러코드로 인식되어 미사용 12/20 lilylee
    // await client.users.updateUser({
    //   userId,
    //   profileImageUrl: imageUrl,
    // });

    const slicedBuffer = imageBuffer.buffer.slice(
      imageBuffer.byteOffset,
      imageBuffer.byteOffset + imageBuffer.byteLength
    ) as ArrayBuffer;

    const fileBlob = new Blob([slicedBuffer], { type: fileType });

    await client.users.updateUserProfileImage(userId, {
      file: fileBlob,
    });
    
  } catch (error) {
    console.error("Failed to update Clerk profile image", error);
    return NextResponse.json(
      { message: "프로필 사진을 저장하는 도중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ imageUrl });
}
