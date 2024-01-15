import React from "react";
import Head from "next/head";

export default function Header() {
  return (
    <Head>
      <title>FE-Leads</title>
      <meta
        name="description"
        content="FEleads - individuelle Solar-Beratung."
      />

      <link rel="icon" href="/FEleads.svg" />
    </Head>
  );
}
