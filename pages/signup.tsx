"use client";
import ReactDOMServer from "react-dom/server";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Loader, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { countries } from "@/data/countries";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAccessToken } from "@/lib/auth";
import { VerificationMail } from "@/data/email";
import Collage from "@/components/common/Collage";
import Preferences from "@/components/common/preferences";

interface FormData {
  name: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  cpassword: string;
  profileImage: string;
  languages: string[];
  genres: string[];
}

export const Signup = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formSchema = z
    .object({
      name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
      }),
      email: z.string().email({ message: "Invalid email address." }),
      country: z.string().min(1, { message: "Country is required." }),
      phone: z
        .string()
        .regex(/^\d{10}$/, { message: "Name must be 10 digits." }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
      cpassword: z
        .string()
        .min(8, { message: "Confirm password is required." }),
      profileImage: z.string().url().optional(),
      languages: z.array(z.string()).optional(),
      genres: z.array(z.string()).optional(),
    })
    .refine((data) => data.password === data.cpassword, {
      path: ["cpassword"],
      message: "Passwords do not match",
    });

  const formMethods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      phone: "",
      password: "",
      cpassword: "",
      profileImage:
        "https://pluspng.com/img-png/user-png-icon-big-image-png-2240.png",
      languages: [],
      genres: [],
    },
  });

  const resetForm = () => {
    formMethods.reset({
      name: "",
      email: "",
      country: "",
      phone: "",
      password: "",
      cpassword: "",
      profileImage:
        "https://pluspng.com/img-png/user-png-icon-big-image-png-2240.png",
      languages: [],
      genres: [],
    });
  };

  const { handleSubmit, control, setValue, watch } = formMethods;

  const selectedCountry = watch("country");

  useEffect(() => {
    setValue("country", selectedCountry);
  }, [selectedCountry, setValue]);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true);

      let profileImageUrl = formData.profileImage;

      if (imageFile) {
        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(`Avatar/${uniqueId}_${imageFile.name}`, imageFile);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading profile image",
          });
          resetForm();
          return;
        }

        const downloadUrl = await supabase.storage
          .from("Images")
          .getPublicUrl(`Avatar/${uniqueId}_${imageFile.name}`);
        profileImageUrl = downloadUrl.data.publicUrl;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, profileImage: profileImageUrl }),
        }
      );

      if (response.ok) {
        const { verificationToken } = await response.json();
        toast({
          description: "Account created successfully!",
        });
        resetForm();

        const htmlContent = ReactDOMServer.renderToStaticMarkup(
          <VerificationMail token={verificationToken} />
        );

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
              htmlContent,
            }),
          }
        );

        if (emailResult.ok) {
          toast({
            description: "Verification Email sent successfully!",
          });
          router.push("/login");
          resetForm();
        } else {
          toast({
            variant: "destructive",
            description: "Failed to send email!",
          });
          resetForm();
        }
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          description: errorData.error || "Error creating account",
        });
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: `Something went wrong: ${error}`,
      });
      resetForm();
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    } else {
      setValue(
        "profileImage",
        "https://pluspng.com/img-png/user-png-icon-big-image-png-2240.png"
      );
      setImageFile(null);
    }
  };

  const SavePreferences = (languages: string[], genres: string[]) => {
    setValue("languages", languages);
    setValue("genres", genres);
  };

  return (
    <>
      <div className="w-full flex justify-center p-4">
        {/* <Collage /> */}
        <div className="w-3/4">
          <div className="space-y-1">
            <h2 className="text-2xl text-center text-white">
              Create an account
            </h2>
            <h4 className="text-center text-sm text-muted-foreground">
              Enter your details below to create your account
            </h4>
          </div>
          <Form {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-2 items-center w-full gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No.</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          maxLength={10}
                          pattern="[0-9]*"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="pt-8">
                      <FormControl>
                        <Select
                          value={selectedCountry}
                          onValueChange={(val) => setValue("country", val)}
                        >
                          <div className="flex items-center gap-1">
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.name}
                                >
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            <Tooltip delayDuration={1}>
                              <TooltipTrigger asChild>
                                <Info
                                  className="text-white cursor-pointer"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Use the built-in search feature by entering
                                  the country&apos;s first letter to select it
                                  quickly.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-7">
                  <Button
                    variant={"outline"}
                    className="flex items-center justify-start w-max"
                    onClick={(e) => {
                      e.preventDefault();
                      setDialogOpen(true);
                    }}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    <span>Preferences</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
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
                <FormField
                  control={control}
                  name="cpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-4 flex justify-center">
                <Button type="submit" className="w-max bg-black font-semibold">
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <p>Create Account</p>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div>
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
              Already have an account?&nbsp;
              <Link
                href="/login"
                className=" text-blue-600 font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <Preferences
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
          SavePreferences={SavePreferences}
        />
      )}
    </>
  );
};

export default Signup;
