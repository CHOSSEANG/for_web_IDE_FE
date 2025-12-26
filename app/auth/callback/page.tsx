import { redirect } from "next/navigation";

interface AuthCallbackRedirectPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function AuthCallbackRedirectPage({
  searchParams,
}: AuthCallbackRedirectPageProps) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
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
