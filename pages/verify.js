"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "lucide-react";

const Verify = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { token } = router.query;

        if (!token) {
          setMessage("Invalid verification link.");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          setMessage(result.message);
          startRedirectTimer();
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Error verifying email.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setMessage("Something went wrong while verifying the email.");
        setLoading(false);
      }
    };

    const startRedirectTimer = () => {
      let seconds = 3;
      const intervalId = setInterval(() => {
        setTimer(seconds);
        seconds--;

        if (seconds < 0) {
          clearInterval(intervalId);
          setLoading(false);
          router.push("/login");
        }
      }, 1000);
    };

    verifyUser();
  }, [router.query]);

  return (
    <>
      {loading ? (
        <Loader className="text-white" />
      ) : (
        <div className="flex py-4 text-white flex-col justify-center items-center min-h-screen">
          <div className="w-full m-auto lg:max-w-lg text-center">
            <p className="text-2xl font-semibold mb-4">{message}</p>
            {timer >= 0 && <p>Redirecting in {timer} seconds...</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Verify;
