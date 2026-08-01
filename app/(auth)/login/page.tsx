import { LoginForm } from "./login-form";

type Props = {
  searchParams: Promise<{ next?: string; registered?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next, registered } = await searchParams;

  return <LoginForm next={next} registered={registered === "1"} />;
}
