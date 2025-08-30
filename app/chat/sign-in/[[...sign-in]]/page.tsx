import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn routing="path" path="/chat/sign-in" />;
} 