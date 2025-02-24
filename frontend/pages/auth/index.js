import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Auth() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, []);
  return null;
}
