"use client";
// pages/accept.js
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const Accept = ({ liveTalkInfo }) => {
  const router = useRouter();

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found in localStorage");
    router.push("/login");
    return;
  }

  const handleAccept = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug: liveTalkInfo.slug, accept: true }),
      });

      if (response.ok) {
        router.push(`/live/${liveTalkInfo.slug}`);
      } else {
        console.error("Error accepting invitation:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting invitation:", error.message);
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  if (!liveTalkInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="w-[350px]">
          <div>
            <h2>Join Live Podcast as Guest : {liveTalkInfo.title}</h2>
            <p>Hosted by: {liveTalkInfo.hostname}</p>
          </div>
          <div className="flex justify-between">
            <Button onClick={handleAccept}>Accept</Button>
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const { invitation } = context.query;

    const liveTalkInfo = await prisma.liveTalk.findUnique({
      where: {
        slug: invitation,
      },
      include: {
        hostUser: true,
        participants: {
          include: {
            guestUser: true,
          },
          where: {
            guestUser: {
              email: context.req.user.email,
            },
          },
        },
      },
    });

    if (!liveTalkInfo) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        liveTalkInfo: liveTalkInfo || null,
      },
    };
  } catch (error) {
    console.error("Error fetching live talk details:", error.message);

    return {
      props: {
        liveTalkInfo: null,
      },
    };
  }
}

export default Accept;
