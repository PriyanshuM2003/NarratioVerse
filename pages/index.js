"use client";
import Head from "next/head";
import Trending from "./trending";

export default function Home() {
  return (
    <>
      <Head>
        <title>Narratioverse</title>
        <meta name="description" content="Narratioverse" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main>
        <Trending />
      </main>
    </>
  );
}
