"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Info, Loader, Music2 } from "lucide-react";
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

const Profile = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { loggedUserData, loadingUserData } = GetLoggedUserData();
  const [loading, setLoading] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [userData, setUserData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    country: selectedCountry,
    bio: "",
    password: "",
    newpassword: "",
    confpassword: "",
    profileImage: "",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (loggedUserData) {
      setUserData(loggedUserData);
    }
  }, [loggedUserData]);

  useEffect(() => {
    setUserData((prevData: any) => ({
      ...prevData,
      country: selectedCountry,
    }));
  }, [selectedCountry]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        setLoading(true);

        const oldImageFileName = userData.profileImage.split("/").pop();
        if (oldImageFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("Images")
              .remove([`Avatar/${oldImageFileName}`]);

          if (removeError) {
            console.error("Error removing old image:", removeError);
          } else {
            console.log("Old image removed successfully:", removeData);
          }
        }

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
          setUserData({
            ...userData,
            profileImage: downloadUrl.data.publicUrl,
          });
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
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updateuser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      toast({
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }

      const currentPassword = userData.password;
      const newPassword = userData.newpassword;
      const confirmedPassword = userData.confpassword;

      if (newPassword !== confirmedPassword) {
        toast({
          variant: "destructive",
          description: "New password and confirmed password do not match",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      toast({
        description: "Password changed successfully",
      });
      setUserData({
        ...userData,
        password: "",
        newpassword: "",
        confpassword: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to change password",
      });
    } finally {
      setLoading(false);
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
            {userData.creator ? (
              <div className="mx-auto flex items-center mb-10 justify-center md:flex-row flex-col">
                <div className="flex items-center justify-center md:mb-5 md:mr-5 flex-col">
                  <Image
                    className="md:w-52 md:h-52 w-32 h-32 mx-auto object-cover object-center rounded-full"
                    alt={userData.name}
                    src={userData.profileImage}
                    width={208}
                    height={208}
                  />
                  <Music2 className="text-yellow-400 mt-2" />
                </div>
                <div className="text-center lg:w-2/3 w-full">
                  <h1 className="title-font sm:text-4xl text-3xl font-medium text-white">
                    {userData.name}
                  </h1>
                  <p className="text-sm text-slate-400 mb-4">
                    {userData.country}
                  </p>
                  <p className="mb-8 text-white leading-relaxed">
                    {userData.bio}
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setShowDetails(true)}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex items-center mb-10 justify-center flex-col">
                <Image
                  className="md:w-52 md:h-52 w-32 h-32 mx-auto object-cover object-center rounded-full"
                  alt={userData.name}
                  src={userData.profileImage}
                  width={208}
                  height={208}
                />
                {userData.premium ? (
                  <Award className="text-yellow-400" />
                ) : (
                  <></>
                )}
                <div className="text-center lg:w-2/3 w-full">
                  <h1 className="title-font sm:text-4xl text-3xl font-medium text-white">
                    {userData.name}
                  </h1>
                  <p className="text-sm text-slate-400 mb-4">
                    {userData.country}
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setShowDetails(true)}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {showDetails ? (
          <form className="w-full text-white">
            <div className="my-4">
              <u className="font-bold text-2xl">Personal Details</u>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  value={userData.name || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  id="name"
                  type="text"
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  name="email"
                  id="email"
                  readOnly
                />
                <span id="email" className="text-xs font-semibold text-red-500">
                  You cannot change your email.
                </span>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  name="phone"
                  id="phone"
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]*"
                  value={userData.phone || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  placeholder="Please enter your 10 digit mobile no."
                />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                <Label htmlFor="country">Select Country</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(val) => setSelectedCountry(val)}
                >
                  <div className="flex items-center gap-1 text-black">
                    <SelectTrigger>
                      <SelectValue placeholder={userData.country} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <Tooltip delayDuration={1}>
                      <TooltipTrigger asChild>
                        <Info className="text-white cursor-pointer" size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Use the built-in search feature by entering the
                          country&apos;s first letter to select it quickly.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </Select>
              </div>
            </div>
            {userData.creator ? (
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    name="bio"
                    className="h-72 md:h-52"
                    id="bio"
                    value={userData.bio || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, bio: e.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <></>
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
              <Button
                onClick={() => {
                  setShowDetails(false);
                  handleUpdateProfile();
                }}
              >
                {loadingUserData ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>Update Profile</>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <></>
        )}
      </div>
      {showDetails ? (
        <div className="mx-auto px-12 pb-6">
          <form className="w-full text-white">
            <div className="mb-4">
              <u className="font-bold text-white text-2xl">Change Password</u>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <Label htmlFor="password">Current Password</Label>
                <Input
                  name="password"
                  id="curpassword"
                  type="password"
                  value={userData.password || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <Label htmlFor="newpassword">New Password</Label>
                <Input
                  name="newpassword"
                  id="newpassword"
                  type="password"
                  value={userData.newpassword || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, newpassword: e.target.value })
                  }
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <Label htmlFor="confpassword">Confirm Password</Label>
                <Input
                  name="confpassword"
                  id="confpassword"
                  type="password"
                  value={userData.confpassword || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, confpassword: e.target.value })
                  }
                />
              </div>
            </div>
          </form>
          <div className="flex md:justify-end justify-center items-center mr-4 mb-4">
            <Button
              onClick={() => {
                setShowDetails(false);
                handleChangePassword();
              }}
            >
              {loadingUserData ? (
                <Loader className="animate-spin" />
              ) : (
                <>Change</>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Profile;
