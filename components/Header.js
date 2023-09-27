import React from "react";
import Head from "next/head";

export default function Header() {
  return (
    <Head>
      <title>FEleads</title>
      <meta
        name="description"
        content="FEleads - individuelle Solar-Beratung."
      />

      <link rel="icon" href="/FEleads.svg" />
    </Head>
  );
}
