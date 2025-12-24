import { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  open: boolean;
  onClose: () => void;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("이미지를 읽을 수 없습니다."));
      }
    };
    reader.onerror = () => {
      reject(new Error("파일을 처리하는 중 오류가 발생했습니다."));
    };
    reader.readAsDataURL(file);
  });

export default function EditProfileImageModal({ open, onClose }: Props) {
  const { isLoaded, user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setIsSaving(false);
    }
  }, [open]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  if (!open) return null;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file) {
      setSelectedFile(file);
      setError(null);
    }

    event.target.value = "";
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError("업로드할 이미지를 선택해주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const [, base64Data] = dataUrl.split(",");

      if (!base64Data) {
        throw new Error("이미지 데이터를 읽을 수 없습니다.");
      }

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          data: base64Data,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(
          errorPayload?.message ?? "이미지 업로드에 실패했습니다."
        );
      }

      await response.json();
      if (isLoaded && user) {
        await user.reload();
      }
      onClose();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "이미지 업로드 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const previewSource = previewUrl ?? user?.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl border border-border-strong bg-bg-raised p-6">
        <VisuallyHidden>
          <h2>프로필 사진 변경</h2>
        </VisuallyHidden>

        {/* 미리보기 */}
        <div className="flex justify-center mb-4">
          {previewSource ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSource}
                alt="선택된 프로필"
                className="h-24 w-24 rounded-full border border-border-strong object-cover"
              />
            </>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border-strong bg-bg-subtle text-3xl">
              👤
            </div>
          )}
        </div>

        {/* 업로드 */}
        <label className="block w-full cursor-pointer rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-center text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
          사진 업로드
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {error && (
          <p className="mt-2 text-xs text-red-300">{error}</p>
        )}

        {/* 액션 */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            disabled={isSaving}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
