"use client";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import {
  CreditCard,
  LogOut,
  Settings2,
  User,
  UserPlus,
  Radio,
  BookAudio,
  BadgePlus,
  LayoutDashboard,
  PlayCircle,
  Podcast,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { DialogTrigger } from "./ui/dialog";
import Preferences from "@/pages/preferences";
import { useRouter } from "next/router";

export function Navbar({
  isLoggedIn,
  handleLogout,
  toggleSidebar,
  isSidebarVisible,
}) {
  const router = useRouter();

  const isActiveLink = (href) => {
    return router.pathname === href;
  };

  return (
    <Menubar className="bg-gray-900 sticky top-0 z-10 flex items-center justify-between text-white border-b-2 rounded-none px-2 lg:px-6">
      <div className="flex items-center space-x-2">
        {isSidebarVisible ? (
          <PanelLeftClose
            className="hover:text-pink-500"
            onClick={toggleSidebar}
          />
        ) : (
          <PanelLeftOpen
            className="hover:text-pink-500"
            onClick={toggleSidebar}
          />
        )}
        <Link href="/">
          <h1 className="text-xl font-bold md:mr-4 hover:text-pink-600">
            Narratioverse
          </h1>
        </Link>
      </div>
      <div className="space-x-6 flex items-center justify-center">
        <Link
          href="/"
          className={`flex w-fit items-center hover:text-pink-600 ${
            isActiveLink("/") &&
            "rounded-sm py-1 px-2 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
          }`}
        >
          <PlayCircle className="w-4 h-4 mr-0.5" />
          Trending
        </Link>
        <Link
          href="#"
          className={`flex w-fit items-center hover:text-pink-600 ${
            isActiveLink("#") &&
            "rounded-sm py-1 px-2 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
          }`}
        >
          <BookAudio className="w-4 h-4 mr-0.5" />
          Audio Books
        </Link>
        <Link
          href="/podcasts"
          className={`flex w-fit items-center hover:text-pink-600 ${
            isActiveLink("/podcasts") &&
            "rounded-sm py-1 px-2 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
          }`}
        >
          <Podcast className="w-4 h-4 mr-0.5" />
          Podcasts
        </Link>
        <Link
          href="#"
          className={`flex w-fit items-center hover:text-pink-600 ${
            isActiveLink("#") &&
            "rounded-sm py-1 px-2 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
          }`}
        >
          <Radio className="w-4 h-4 mr-0.5" />
          Live
        </Link>
        <Link
          href="#"
          className={`flex w-fit items-center hover:text-pink-600 ${
            isActiveLink("#") &&
            "rounded-sm py-1 px-2 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
          }`}
        >
          <BadgePlus className="w-4 h-4 mr-0.5" />
          New
        </Link>
      </div>
      {isLoggedIn ? (
        <MenubarMenu>
          <MenubarTrigger className="flex items-center">
            <User />
            <span>My Account</span>
          </MenubarTrigger>
          <MenubarContent className="bg-gray-900 text-white" forceMount>
            <Link href="/profile">
              <MenubarItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </MenubarItem>
            </Link>
            <DialogTrigger asChild>
              <div className="flex font-semibold cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground overflow-hidden hover:bg-popover hover:text-popover-foreground hover:shadow-lg">
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </div>
            </DialogTrigger>
            <Preferences />
            <Link href="/dashboard">
              <MenubarItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </MenubarItem>
            </Link>
            <Link href="/plans">
              <MenubarItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </MenubarItem>
            </Link>
            <MenubarSeparator />
            <MenubarItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      ) : (
        <MenubarMenu>
          <MenubarTrigger className="flex items-center">
            <User />
            <span>Account</span>
          </MenubarTrigger>
          <MenubarContent className="bg-gray-900 text-white" forceMount>
            <Link href="/login">
              <MenubarItem>
                <User className="mr-2 h-4 w-4" />
                <span>Login</span>
              </MenubarItem>
            </Link>
            <Link href="/signup">
              <MenubarItem>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Create Account</span>
              </MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
      )}
    </Menubar>
  );
}
