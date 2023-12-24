"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
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
        const { token, user, message } = await response.json();
        localStorage.setItem("token", token);
        toast({
          description: "Logged in successfully",
        });
        setEmail("");
        setPassword("");
        console.log(message, user);
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const { error } = await response.json();
        toast({
          variant: "destructive",
          description: `Login failed: ${error}`,
        });
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
    }
  };

  return (
    <>
      <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
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
            <CardContent className="grid gap-4">
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
                Login
              </Button>
              <p className="mt-2 text-xs text-center text-gray-400">
                {" "}
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className=" text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
