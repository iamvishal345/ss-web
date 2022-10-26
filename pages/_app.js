import { UserProvider } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import "react-notifications-component/dist/theme.css";
import { ReactNotifications } from "react-notifications-component";
import "../styles/globals.css";
import "../styles/index.scss";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <TopProgressBar />
      <ReactNotifications isMobile />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
