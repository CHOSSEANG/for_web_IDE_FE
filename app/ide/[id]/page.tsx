import ClientIdeShell from "@/app/ide/components/ClientIdeShell";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IdePage({ params }: PageProps) {
  const { id } = await params;
  return <ClientIdeShell id={id} />;
}
