"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAccessToken } from "@/lib/auth";

interface LoginFormInputs {
  email: string;
  password: string;
}
interface Props {
  setIsLoggedIn: React.Dispatch<boolean>;
}

const Login: React.FC<Props> = ({ setIsLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  });

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = () => {
    formMethods.reset({
      email: "",
      password: "",
    });
  };

  const { handleSubmit, control } = formMethods;

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        toast({
          description: "Logged in successfully",
        });
        setIsLoggedIn(true);
        resetForm();
        router.push("/");
        window.location.reload();
      } else {
        const { error } = await response.json();
        toast({
          variant: "destructive",
          description:
            error === "User not verified."
              ? "User not verified. Please verify your email before logging in."
              : `Login failed: ${error}`,
        });
        resetForm();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Login failed: ${error}`,
      });
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center mx-auto max-w-lg min-h-screen">
        <div className="space-y-1">
          <div className="text-2xl text-center text-white">Log in</div>
          <div className="text-center text-muted-foreground">
            Enter your email and password to login
          </div>
        </div>
        <Form {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-black font-semibold">
              {loading ? <Loader className="animate-spin" /> : <p>Login</p>}
            </Button>
          </form>
        </Form>
        <div>
          <Link
            href="#"
            className="text-blue-600 flex justify-center font-semibold mt-2 text-xs text-center hover:underline"
          >
            Forgot Password?
          </Link>
          <div className="mt-2 text-xs text-center text-gray-400">
            Don&apos;t have an account?&nbsp;
            <Link
              href="/signup"
              className=" text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
