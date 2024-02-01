"use client";
import {
  FolderTree,
  PlusCircle,
  Podcast,
  Search,
  BookAudio,
} from "lucide-react";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import playlists from "@/data/playlists";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = ({ toggleSidebar }) => {
  const router = useRouter();

  const isActiveLink = (href) => {
    return router.pathname === href;
  };

  return (
    <>
      <div
        onClick={toggleSidebar}
        className="fixed md:hidden inset-0 bg-black opacity-50 z-50"
      ></div>
      <div className="text-white block max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:top-10 max-md:z-50 min-h-screen border-r-2 w-52 bg-gray-900">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="flex-nowrap flex-col space-y-2 text-white">
            {/* <Link
              href="/"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Trending
            </Link> */}
            <Link
              href="#"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("#") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Link>
            <Link
              href="/golive"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/golive") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Podcast className="w-4 h-4 mr-2" />
              Go Live
            </Link>
            <Link
              href="/add"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/add") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add&nbsp;
              <Podcast className="w-5 h-5" /><BookAudio className="w-5 h-5" />
            </Link>
            <Link
              href="/your"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/your") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Your&nbsp;
              <Podcast className="w-5 h-5" /><BookAudio className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Separator />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="flex-nowrap flex-col space-y-2 text-white">
            <Link
              href="/playlists"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/playlists") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M21 15V6" />
                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" />
                <path d="M16 6H3" />
                <path d="M12 18H3" />
              </svg>
              Playlists
            </Link>
            <Link
              href="/songs"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/songs") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="8" cy="18" r="4" />
                <path d="M12 18V2l7 4" />
              </svg>
              Songs
            </Link>
            <Link
              href="/mfy"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/mfy") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Made for You
            </Link>
            <Link
              href="/artists"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/artists") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                <circle cx="17" cy="7" r="5" />
              </svg>
              Artists
            </Link>
            <Link
              href="/albums"
              className={`w-full flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/albums") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m16 6 4 14" />
                <path d="M12 6v14" />
                <path d="M8 8v12" />
                <path d="M4 4v16" />
              </svg>
              Albums
            </Link>
          </div>
        </div>
        <Separator />
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="flex-nowrap flex-col space-y-1 p-2 text-white">
              {playlists?.map((playlist, i) => (
                <Link
                  href={`/${playlist}`}
                  key={`${playlist}-${i}`}
                  value={playlist}
                  className={`w-full flex items-center justify-start hover:text-pink-600 ${
                    isActiveLink(`/${playlist}`) &&
                    "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15V6" />
                    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M12 12H3" />
                    <path d="M16 6H3" />
                    <path d="M12 18H3" />
                  </svg>
                  {playlist}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
