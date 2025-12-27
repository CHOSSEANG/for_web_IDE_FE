import ClientIdeShell from "@/app/ide/components/ClientIdeShell";

type IdePageParams = {
  id: string;
};

type IdePageParamsPromise = Promise<IdePageParams>;

type PageProps = {
  params: IdePageParamsPromise & IdePageParams;
};

export default async function IdePage({ params }: PageProps) {
  const { id } = await params;
  const containerId = Number(id);

  if (Number.isNaN(containerId)) {
    throw new Error("Invalid IDE id");
  }

  return <ClientIdeShell id={containerId} />;
}
