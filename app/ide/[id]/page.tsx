import ClientIdeShell from "@/app/ide/components/ClientIdeShell";

type IdePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IdePage({ params }: IdePageProps) {
  const { id } = await params;

  return <ClientIdeShell id={id} />;
}
