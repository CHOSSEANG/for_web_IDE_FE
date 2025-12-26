import ClientIdeShell from "@/app/ide/components/ClientIdeShell";

type IdePageParams = {
  id: string;
};

type PageProps = {
  params: IdePageParams;
};

export default function IdePage({ params }: PageProps) {
  const id = Number(params.id);
  return <ClientIdeShell id={id} />;
}
