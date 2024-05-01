"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  LogOut,
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
  Settings2,
} from "lucide-react";
import Preferences from "@/components/preferences";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
  toggleSidebar: () => void;
  isSidebarVisible: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  handleLogout,
  toggleSidebar,
  isSidebarVisible,
}: NavbarProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isActiveLink = (href: string) => {
    return router.pathname === href;
  };
  return (
    <>
      <div className="bg-gray-900 sticky top-0 z-10 flex items-center justify-between text-white border-b-2 rounded-none px-2 py-1 lg:px-6">
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
            href="/audiobooks"
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
          <DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
            <DropdownMenuTrigger className="flex items-center hover:text-pink-600">
              <User />
              <span>My Account</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 text-white" forceMount>
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => {
                  setDialogOpen(true);
                  setOpen(false);
                }}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <Link href="/dashboard">
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/plans">
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:text-pink-600">
              <User />
              <span>Account</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 text-white" forceMount>
              <Link href="/login">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/signup">
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Create Account</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {dialogOpen && (
        <Preferences
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
          SavePreferences={function (
            languages: string[],
            genres: string[]
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </>
  );
};
export default Navbar;
