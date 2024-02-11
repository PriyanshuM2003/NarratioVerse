"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import supabase from "@/lib/supabase";

const Signup = ({ }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    state: "",
    phone: "",
    password: "",
    cpassword: "",
    profileImage:
      "https://pluspng.com/img-png/user-png-icon-big-image-png-2240.png",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSignup = async () => {
    if (formData.password !== formData.cpassword) {
      toast({
        variant: "destructive",
        description: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const { verificationToken } = await response.json();
        toast({
          description: "Account created successfully!",
        });

        try {
          const emailResult = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/mailer`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                recipient: formData.email,
                subject: "Welcome to Narratioverse",
                htmlContent: `
                <body
  style="
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    padding: 20px;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #2e3d49;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    "
  >
    <h1
      style="
        font-size: 28px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
      "
    >
      <span style="color: #ffffff">Narratioverse</span>
    </h1>
    <p style="font-size: 18px; color: #ffffff; text-align: center">
      <strong>Welcome to Narratioverse!</strong> <br />
      Thank you for registering with us.
    </p>
    <a
      href="${process.env.NEXT_PUBLIC_HOST}/verify?token=${verificationToken}"
      style="
        display: block;
        margin: 20px auto;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background-color: #000000;
        border: 2px solid #ffffff;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease,
          border-color 0.3s ease;
      "
      onmouseover="this.style.backgroundColor='#333333'; this.style.color='#fff'; this.style.borderColor='#000000'"
      onmouseout="this.style.backgroundColor='#000000'; this.style.color='#fff'; this.style.borderColor='#333333'"
    >
      Please click this button to Verify yourself
    </a>
    <p
      style="margin-top: 30px; font-size: 14px; color: #777; text-align: center"
    >
      If you didn't create an account with us, you can ignore this message.
    </p>

    <p style="font-size: 14px; color: #888; text-align: center">
      Best Regards,<br />
      NARRATIOVERSE Team
    </p>
  </div>
</body>
`,
              }),
            }
          );

          if (emailResult.ok) {
            toast({
              description: "Verification Email sent successfully!",
            });
            console.log("Email sent successfully!");
          } else {
            toast({
              variant: "destructive",
              description: "Failed to send email!",
            });
            console.error("Failed to send email");
          }
        } catch (error) {
          console.error("Error:", error);
        }
        setFormData("");
        router.push("/login");
        setLoading(false);
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          description: errorData.error || "Error creating account",
        });
        setFormData("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: `Something went wrong:${error}`,
      });
      setFormData("");
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);
        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(`Avatar/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading profile image",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("Images")
            .getPublicUrl(`Avatar/${uniqueId}_${file.name}`);
          setFormData((prevData) => ({
            ...prevData,
            profileImage: downloadUrl.data.publicUrl,
          }));
          toast({
            description: "Profile image uploaded successfully",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error uploading profile image",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setFormData({
        ...formData,
        profileImage:
          "https://pluspng.com/img-png/user-png-icon-big-image-png-2240.png",
      });
    }
  };

  return (
    <>
      <div className="flex py-4 flex-col justify-center items-center min-h-screen overflow-hidden">
        <div className="w-full m-auto lg:max-w-lg">
          <Card className="bg-gray-900">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between flex-wrap">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone No.</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpassword">Confirm Password</Label>
                <Input
                  id="cpassword"
                  name="cpassword"
                  type="password"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                className="w-full bg-black font-semibold"
                onClick={handleSignup}
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <p>Create Account</p>
                )}
              </Button>
              <p className="mt-2 text-xs text-center text-gray-400">
                By clicking Create Account, you agree to our&nbsp;
                <Link
                  href="#"
                  className=" text-blue-600 font-semibold hover:underline"
                >
                  Terms of Service
                </Link>
                &nbsp;and&nbsp;
                <Link
                  href="#"
                  className=" text-blue-600 font-semibold hover:underline"
                >
                  Privacy Policy.
                </Link>
              </p>
              <p className="mt-2 text-xs text-center text-gray-400">
                Already have an account?
                <Link
                  href="/login"
                  className=" text-blue-600 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Signup;
