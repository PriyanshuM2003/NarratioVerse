"use client";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const router = useRouter();
  return <p>Post: {router.query.slug}</p>;
}
