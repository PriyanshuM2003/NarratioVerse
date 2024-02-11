"use client";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Accept = ({ liveTalkInfo }) => {
  const router = useRouter();
  const { invitation } = router.query;

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        router.push("/login");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: invitation, accept: true }),
        }
      );
      console.log("Response status:", response.status);
      console.log("Response:", response);
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
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>
              Join Live Podcast "{liveTalkInfo.title}" as Guest
            </CardTitle>
            <CardDescription>
              Hosted by: {liveTalkInfo.hostname}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button onClick={handleAccept}>Accept</Button>
          </CardFooter>
        </Card>
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
        liveTalkInfo:
          {
            title: liveTalkInfo.title,
            hostname: liveTalkInfo.hostUser.name,
            slug: liveTalkInfo.slug,
          } || null,
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
