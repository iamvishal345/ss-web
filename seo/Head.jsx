import Header from "next/head";

export const Head = ({ pageName }) => (
  <Header>
    <title>Shimla Sweets | {pageName}</title>
    <meta name="title" content="Shimla Sweets" />
    <meta name="description" content="Shimla Sweets." />

    {/* <!-- Open Graph / Facebook --> */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://shimlasweets.vercel.app/" />
    <meta property="og:title" content="Shimla Sweets" />
    <meta property="og:description" content="Shimla Sweets." />
    <meta property="og:image" content="/banner.png" />

    {/* <!-- Twitter --> */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://shimlasweets.vercel.app/" />
    <meta property="twitter:title" content="Shimla Sweets" />
    <meta property="twitter:description" content="Shimla Sweets." />
    <meta property="twitter:image" content="/banner.png" />
    <link rel="icon" href="/favicon.ico" />
  </Header>
);
