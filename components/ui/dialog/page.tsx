import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DialogPreview() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open WebIC Dialog</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogClose />
          <DialogTitle>프로젝트 생성</DialogTitle>
          <DialogDescription>새로운 프로젝트 이름을 입력하세요.</DialogDescription>

          <div className="mt-4 space-y-3">
            <Input placeholder="프로젝트 이름" />
            <Button className="w-full mt-3">생성하기</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
