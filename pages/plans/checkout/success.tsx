"use client";
import React, { useEffect } from "react";

const Success = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 text-4xl">
      Order Completed
    </div>
  );
};

export default Success;
