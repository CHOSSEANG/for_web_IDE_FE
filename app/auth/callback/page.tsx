import { redirect } from "next/navigation";

interface AuthCallbackRedirectPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AuthCallbackRedirectPage({
  searchParams,
}: AuthCallbackRedirectPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const params = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  redirect(`/callback${queryString ? `?${queryString}` : ""}`);
}
