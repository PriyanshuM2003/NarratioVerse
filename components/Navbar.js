"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  LogOut,
  User,
  Menu,
  Search,
  Podcast,
  UserPlus,
  Settings2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [state, setState] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <nav className="bg-gray-900 w-full border-b md:border-0">
        <div className="items-center px-4 mx-auto md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:py-3 md:block">
            <Link href="/">
              <h1 className="text-xl font-bold text-white hover:text-pink-600">
                Narratioverse
              </h1>
            </Link>
            <div className="md:hidden">
              <button
                className="text-white outline-none p-2 rounded-md focus:border-white focus:border"
                onClick={() => setState(!state)}
              >
                <Menu />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              state ? "block" : "hidden"
            }`}
          >
            <ul className="md:justify-end justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {!isLoggedIn && (
                <>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger>
                        <DropdownMenuTrigger asChild>
                          <User className="h-8 w-8 text-white hover:text-pink-600" />
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Account</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent className="w-40 font-semibold bg-slate-900 text-white">
                      <DropdownMenuGroup>
                        <Link href="/login">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Login</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/signup">
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Signup</span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              {isLoggedIn && (
                <>
                  <form
                    className={`flex md:w-1/2 items-center space-x-2 border rounded-full p-2 ${
                      showSearch ? "transition-all duration-300" : "hidden"
                    }`}
                  >
                    <Search className="h-6 w-6 flex-none text-gray-300" />
                    <input
                      className="w-full outline-none appearance-none bg-gray-900 placeholder-white text-white"
                      type="text"
                      placeholder="Search"
                    />
                  </form>
                  <Tooltip>
                    <li
                      className="text-white hover:text-pink-600"
                      onClick={toggleSearch}
                    >
                      <TooltipTrigger asChild>
                        <Search className="h-8 w-8 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Search</p>
                      </TooltipContent>
                    </li>
                  </Tooltip>
                  <Tooltip>
                    <li className="text-white hover:text-pink-600">
                      <TooltipTrigger asChild>
                        <Link href="/">
                          <Podcast className="h-9 w-9" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Go Live</p>
                      </TooltipContent>
                    </li>
                  </Tooltip>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger>
                        <DropdownMenuTrigger asChild>
                          <User className="h-8 w-8 text-white hover:text-pink-600" />
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">My Account</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent className="w-40 font-semibold bg-slate-900 text-white">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href="/profile">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <Settings2 className="mr-2 h-4 w-4" />
                          <span>Preferences</span>
                        </DropdownMenuItem>
                        <Link href="/plans">
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
