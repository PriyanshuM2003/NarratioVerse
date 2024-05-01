"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Verify: React.FC = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [timer, setTimer] = useState<number>(3);
  let intervalId: NodeJS.Timeout | undefined;

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
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setMessage("Something went wrong while verifying the email.");
      }
    };

    const startRedirectTimer = () => {
      let seconds = 3;
      intervalId = setInterval(() => {
        setTimer(seconds);
        seconds--;

        if (seconds < 0) {
          clearInterval(intervalId);
          router.push("/login");
        }
      }, 1000);
    };

    verifyUser();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router.query]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="max-w-lg p-6 bg-gray-800 rounded shadow-lg">
          <p className="text-3xl font-semibold mb-4">{message}</p>
          {timer >= 0 && (
            <p className="text-lg">Redirecting in {timer} seconds...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Verify;
