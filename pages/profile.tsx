"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Info, Loader, Music2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
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
import { countries } from "@/data/countries";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import supabase from "@/lib/supabase";
import GetLoggedUserData from "@/routes/getLoggedUserData";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth";
interface FormData {
  name: string;
  email: string;
  country: string;
  phone: string;
  bio: string;
  profileImage: string;
}

interface PasswordData {
  password: string;
  newpassword: string;
  confpassword: string;
}

const Profile = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { loggedUserData, loadingUserData, refreshLoggedUserData } =
    GetLoggedUserData();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const userFormSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .optional(),
    email: z.string().email({ message: "Invalid email address." }).optional(),
    country: z.string().min(1, { message: "Country is required." }).optional(),
    phone: z
      .string()
      .regex(/^\d{10}$/, { message: "Phone number must be 10 digits." })
      .optional(),
    bio: z.string().optional(),
    profileImage: z.string().url().optional(),
  });

  const passwordFormSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .optional(),
      newpassword: z
        .string()
        .min(8, { message: "New password is required." })
        .optional(),
      confpassword: z
        .string()
        .min(8, { message: "Confirm password is required." })
        .optional(),
    })
    .refine((data) => data.newpassword === data.confpassword, {
      path: ["confpassword"],
      message: "Passwords do not match",
    });

  const userFormMethods = useForm<FormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      phone: "",
      bio: "",
      profileImage: "",
    },
  });

  const passwordFormMethods = useForm<PasswordData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      newpassword: "",
      confpassword: "",
    },
  });

  const {
    handleSubmit: handleUserSubmit,
    setValue: setUserValue,
    watch: watchUser,
  } = userFormMethods;
  const { handleSubmit: handlePasswordSubmit, setValue: setPasswordValue } =
    passwordFormMethods;

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (loggedUserData) {
      setUserValue("name", loggedUserData.name || "");
      setUserValue("email", loggedUserData.email || "");
      setUserValue("country", loggedUserData.country || "");
      setUserValue("phone", loggedUserData.phone || "");
      setUserValue("bio", loggedUserData.bio || "");
      setUserValue("profileImage", loggedUserData.profileImage || "");
      setSelectedCountry(loggedUserData.country || "");
    }
  }, [loggedUserData, setUserValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleUpdateProfile: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }

      if (imageFile) {
        const oldImageFileName = watchUser("profileImage").split("/").pop();
        if (oldImageFileName) {
          const { error: removeError } = await supabase.storage
            .from("Images")
            .remove([`Avatar/${oldImageFileName}`]);

          if (removeError) {
            console.error("Error removing old image:", removeError);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("Images")
          .upload(`Avatar/${uniqueId}_${imageFile.name}`, imageFile);

        if (uploadError) {
          toast({
            variant: "destructive",
            description: "Error uploading profile image",
          });
          return;
        } else {
          const downloadUrl = await supabase.storage
            .from("Images")
            .getPublicUrl(`Avatar/${uniqueId}_${imageFile.name}`);
          data.profileImage = downloadUrl.data.publicUrl;
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updateuser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      toast({
        description: "Profile updated successfully",
      });
      setImageFile(null);
      refreshLoggedUserData();
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
      setShowDetails(false);
    }
  };

  const handleChangePassword: SubmitHandler<PasswordData> = async (data) => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }

      const { password, newpassword } = data;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: password,
            newPassword: newpassword,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      toast({
        description: "Password changed successfully",
      });
      setPasswordValue("password", "");
      setPasswordValue("newpassword", "");
      setPasswordValue("confpassword", "");
      refreshLoggedUserData();
    } catch (error) {
      console.error("Password change failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to change password",
      });
    } finally {
      setLoading(false);
      setShowDetails(false);
    }
  };

  return (
    <>
      <div className="min-h-screen mx-auto p-12">
        {loadingUserData ? (
          <>
            <div className="mx-auto flex items-center justify-center flex-col">
              <Skeleton className="md:w-52 md:h-52 w-32 h-32 mx-auto mb-5 rounded-full" />
              <div className="space-y-2 flex items-center justify-center flex-col">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px] md:w-[800px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </>
        ) : (
          <>
            {loggedUserData?.creator ? (
              <div className="mx-auto flex items-center mb-10 justify-center md:flex-row flex-col">
                <div className="flex items-center justify-center md:mb-5 md:mr-5 flex-col">
                  <Image
                    className="md:w-52 bg-white md:h-52 w-32 h-32 mx-auto object-cover object-center rounded-full"
                    alt={loggedUserData.name}
                    src={loggedUserData.profileImage!}
                    width={208}
                    height={208}
                  />
                  <Music2 className="text-yellow-400 mt-2" />
                </div>
                <div className="text-center lg:w-2/3 w-full">
                  <h1 className="title-font sm:text-4xl text-3xl font-medium text-white">
                    {loggedUserData.name}
                  </h1>
                  <p className="text-sm text-slate-400 mb-4">
                    {loggedUserData.country}
                  </p>
                  <p className="mb-8 text-white leading-relaxed">
                    {loggedUserData.bio}
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setShowDetails(!showDetails)}>
                      {showDetails ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex items-center mb-10 justify-center flex-col">
                <Image
                  className="md:w-52 bg-white md:h-52 w-32 h-32 mx-auto object-cover object-center rounded-full"
                  alt={loggedUserData?.name!}
                  src={loggedUserData?.profileImage!}
                  width={208}
                  height={208}
                />
                {loggedUserData?.premium ? (
                  <Award className="text-yellow-400" />
                ) : null}
                <div className="text-center lg:w-2/3 w-full">
                  <h1 className="title-font sm:text-4xl text-3xl font-medium text-white">
                    {loggedUserData?.name}
                  </h1>
                  <p className="text-sm text-slate-400 mb-4">
                    {loggedUserData?.country}
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setShowDetails(!showDetails)}>
                      {showDetails ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {showDetails && (
          <div className="space-y-4">
            <u className="font-bold text-white text-2xl">Personal Details</u>
            <Form {...userFormMethods}>
              <form
                onSubmit={handleUserSubmit(handleUpdateProfile)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userFormMethods.control}
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
                    control={userFormMethods.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription className="text-xs font-semibold text-red-500">
                          You cannot change your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 grid-cols-3">
                  <FormField
                    control={userFormMethods.control}
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
                    control={userFormMethods.control}
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
                        <FormDescription>
                          Upload a new profile picture.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userFormMethods.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Select
                            value={selectedCountry}
                            onValueChange={(value) => {
                              setSelectedCountry(value);
                              setUserValue("country", value);
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
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
                </div>
                {loggedUserData?.creator && (
                  <FormField
                    control={userFormMethods.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <p className="text-sm text-gray-300 dark:text-gray-400">
                  We’ll never share your details. Read our&nbsp;
                  <Link
                    href="#"
                    className="font-medium text-blue-500 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <div className="flex mx-auto justify-center mt-4">
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <>Update Profile</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <u className="font-bold text-white text-2xl">Change Password</u>
            <Form {...passwordFormMethods}>
              <form
                onSubmit={handlePasswordSubmit(handleChangePassword)}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={passwordFormMethods.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordFormMethods.control}
                    name="newpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordFormMethods.control}
                    name="confpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <>Change</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
