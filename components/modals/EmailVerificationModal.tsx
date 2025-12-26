// @/components/modals/EmailVerificationModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { SignUpResource } from "@clerk/types";

type Props = {
  open: boolean;
  signUp: SignUpResource;
  email: string;
  onSuccess: () => void;
  onClose?: () => void;
};

const RESEND_COOLDOWN_SECONDS = 30;

export default function EmailVerificationModal({
  open,
  signUp,
  email,
  onSuccess,
  onClose,
}: Props) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = async () => {
    if (isSubmitting || code.length !== 6) return;

    if (signUp.status === "complete") {
      onSuccess();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        onSuccess();
      } else {
        setErrorMessage("인증을 완료할 수 없습니다. 다시 시도해주세요.");
      }
    } catch {
      setErrorMessage("인증 코드가 올바르지 않거나 만료되었습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || signUp.status === "complete") return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setErrorMessage("인증 코드는 30초 후 다시 요청할 수 있습니다.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose?.();
      }}
    >
      <DialogContent
        className="
          sm:max-w-[420px]
          fixed left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
        "
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={() => onClose?.()}
          aria-label="닫기"
          className="absolute right-4 top-4 rounded-full p-2 text-text-muted hover:text-text-primary transition"
        >
          <X size={18} />
        </button>

        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            이메일 인증
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium text-foreground">{email}</span>
            <br />
            로 전송된 인증 코드를 입력해주세요.
          </p>

          <p className="text-xs text-muted-foreground text-center">
            • 인증 코드는 약 10분간 유효합니다.<br />
            • 인증 코드는 30초 후 다시 요청할 수 있습니다.
          </p>

          <Input
            placeholder="6자리 인증 코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            inputMode="numeric"
          />

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}

          <Button
            onClick={handleVerify}
            disabled={isSubmitting || code.length !== 6}
            className="w-full"
          >
            {isSubmitting ? "확인 중..." : "인증 완료"}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="w-full text-xs text-muted-foreground hover:underline disabled:opacity-50"
          >
            {cooldown > 0
              ? `${cooldown}초 후 재전송 가능`
              : "인증 코드 다시 보내기"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
