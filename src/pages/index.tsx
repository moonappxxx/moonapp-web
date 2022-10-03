import type { NextPage } from "next";
import Head from "next/head";

import SeedPanel from "../features/seed/SeedPanel";

const Seed: NextPage = () => {
  return (
    <>
      <Head>
        <title>MoonApp Claim portal for Pre-Seed &amp; Seed</title>
        <meta
          name="description"
          content="MoonApp Claim portal for Pre-Seed &amp; Seed"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SeedPanel />
    </>
  );
};

export default Seed;
