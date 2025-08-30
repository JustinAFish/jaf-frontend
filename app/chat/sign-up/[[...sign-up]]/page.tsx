import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp routing="path" path="/chat/sign-up" />;
} 