"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Preferences from "@/components/preferences";
import { useRouter } from "next/router";
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

  const isActiveLink = (href: string) => router.pathname === href;

  return (
    <>
      <div className="bg-gray-800 sticky top-0 z-10 flex items-center justify-between text-white">
        <div
          className={cn(
            "flex items-center gap-3.5 pt-1 px-5 ",
            isSidebarVisible && "bg-gray-900 border-r-2"
          )}
        >
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
            <h1 className="text-xl font-bold hover:text-pink-600">
              Narratioverse
            </h1>
          </Link>
        </div>
        <DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
          <DropdownMenuTrigger className="flex items-center pt-1 pr-6 hover:text-pink-600">
            <User />
            <span>{isLoggedIn ? "My Account" : "Account"}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 text-white" forceMount>
            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => setDialogOpen(true)}>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
