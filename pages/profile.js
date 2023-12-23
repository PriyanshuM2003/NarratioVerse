"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    bio: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.user);
      })
      .catch((error) => {
        console.error("Token verification failed:", error);
        router.push("/");
      });
  }, [router]);

  return (
    <>
      <div className="min-h-screen mx-auto p-12">
        <form className="w-full">
          <div className="my-4">
            <u className="font-bold text-pink-500 text-xl">Personal Details</u>
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
          <Button>Update Profile</Button>
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
              <Input name="password" id="curpassword" type="password" />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label htmlFor="newpassword">New Password</Label>
              <Input name="newpassword" id="newpassword" type="password" />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label htmlFor="confpassword">Confirm Password</Label>
              <Input name="confpassword" id="confpassword" type="password" />
            </div>
          </div>
        </form>
        <div className="flex justify-end items-end mr-4 mb-4">
          <Button>Change</Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
