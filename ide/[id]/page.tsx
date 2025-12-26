import ClientIdeShell from "@/app/ide/components/ClientIdeShell";

type PageProps = {
  params: {
    id: string;
  };
};

export default function IdePage({ params }: PageProps) {
  const containerId = Number(params.id);

  if (Number.isNaN(containerId)) {
    throw new Error("Invalid IDE id");
  }

  return <ClientIdeShell id={containerId} />;
}
