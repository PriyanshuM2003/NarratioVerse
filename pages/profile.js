"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    bio: "",
    password: "",
    newpassword: "",
    confpassword: "",
  });

  useEffect(() => {
    fetchUserData().finally(() => setLoading(false));
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error("Token verification failed:", error);
      router.push("/");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
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
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
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
    }
  };

  return (
    <>
      <div className="min-h-screen mx-auto p-12">
        <form className="w-full">
          <div className="my-4">
            <u className="font-bold text-pink-500 text-xl">Personal Details</u>
          </div>
          {loading ? (
            <>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              {userData.creator ? (
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <Skeleton className="min-h-[80px] w-full" />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
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
                  <span
                    id="email"
                    className="text-xs font-semibold text-red-500"
                  >
                    You cannot change your email.
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    maxLength="10"
                    pattern="\d{10}"
                    name="phone"
                    id="phone"
                    type="text"
                    value={userData.phone || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    placeholder="Please enter your 10 digit mobile no."
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-6">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    type="text"
                    name="country"
                    id="country"
                    value={userData.country || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, country: e.target.value })
                    }
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <Label htmlFor="state">State</Label>
                  <Input
                    type="text"
                    name="state"
                    id="state"
                    value={userData.state || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, state: e.target.value })
                    }
                  />
                </div>
              </div>
              {userData.creator ? (
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      name="bio"
                      id="bio"
                      type="text"
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
            </>
          )}
          <p className="mt-2 text-sm text-gray-300 dark:text-gray-400">
            We’ll never share your details. Read our{" "}
            <a
              href="#"
              className="font-medium text-pink-500 hover:underline dark:text-pink-500"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
        <div className="flex mx-auto justify-center mt-4">
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
        </div>
      </div>
      <div className="mx-auto px-16">
        <form className="w-full">
          <div className="mb-4">
            <u className="font-bold text-pink-500 text-xl">Change Password</u>
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
        <div className="flex justify-end items-end mr-4 mb-4">
          <Button onClick={handleChangePassword}>Change</Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
