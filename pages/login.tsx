"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import jwt, { Secret } from "jsonwebtoken";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  setIsLoggedIn: React.Dispatch<boolean>;
}

const Login: React.FC<Props> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    } else {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        refreshAccessToken(refreshToken)
          .then((accessToken) => {
            localStorage.setItem("token", accessToken);
            router.replace("/");
          })
          .catch((error) => {
            console.error("Failed to refresh access token:", error);
          });
      }
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        toast({
          description: "Logged in successfully",
        });
        setEmail("");
        setPassword("");
        router.push("/");
        setIsLoggedIn(true);
      } else {
        const { error } = await response.json();

        if (error === "User not verified.") {
          toast({
            variant: "destructive",
            description:
              "User not verified. Please verify your email before logging in.",
          });
        } else {
          toast({
            variant: "destructive",
            description: `Login failed: ${error}`,
          });
        }
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Login failed: ${error}`,
      });
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/login`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (response.ok) {
        const { accessToken } = await response.json();
        return accessToken;
      } else {
        throw new Error("Failed to refresh access token.");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen overflow-hidden">
        <div className="w-full m-auto lg:max-w-lg">
          <Card className="bg-gray-900">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">
                Log in
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to login
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-white">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                className="w-full bg-black font-semibold"
                onClick={handleLogin}
              >
                {loading ? <Loader className="animate-spin" /> : <p>Login</p>}
              </Button>
              <Link
                href="#"
                className="text-blue-600 font-semibold mt-2 text-xs text-center hover:underline"
              >
                Forgot Password?
              </Link>
              <div className="mt-2 text-xs  text-center text-gray-400">
                Don&apos;t have an account?&nbsp;
                <Link
                  href="/signup"
                  className=" text-blue-600 font-semibold hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
