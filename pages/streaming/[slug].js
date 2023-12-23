"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Stream() {
  const router = useRouter();
  return <p>Post: {router.query.slug}</p>;
}
