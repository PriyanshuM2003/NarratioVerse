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
  LayoutDashboard,
} from "lucide-react";
import { DialogTrigger } from "./ui/dialog";
import Preferences from "@/pages/preferences";

export function Menu({ isLoggedIn, handleLogout }) {
  return (
    <Menubar className="bg-gray-900 flex items-center justify-between text-white border-b-2 rounded-none px-2 lg:px-6">
      <Link href="/">
        <h1 className="text-xl font-bold mr-4 hover:text-pink-600">
          Narratioverse
        </h1>
      </Link>
      {isLoggedIn ? (
        <MenubarMenu>
          <MenubarTrigger className="flex items-center">
            <User />
            My Account
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
            Account
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
