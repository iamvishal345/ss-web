import { Head } from "../seo/Head";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Customers } from "../components/Customers";

export default function CustomersPage() {
  return (
    <>
      <Head pageName={"Customers"} />
      <main className=" h-100 d-flex flex-column align-items-center ">
        <Customers />
      </main>
    </>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });
