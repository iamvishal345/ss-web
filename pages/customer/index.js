import { useRouter } from "next/router";
import { useEffect } from "react";

const Customer = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return "";
};

export default Customer;
