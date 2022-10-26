import { useRouter } from "next/router";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Customer } from "../../components/Customer";
import { Head } from "../../seo/Head";

const CustomerDetails = () => {
  const router = useRouter();
  const { customerId } = router.query;

  return (
    <main className="h-100 d-flex align-items-center flex-column p-0 ">
      <Head pageName={"Customer Details"} />
      <Customer customerId={customerId} />
    </main>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

export default CustomerDetails;
