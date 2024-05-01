"use client";
import React from "react";
import {
  FolderTree,
  PlusCircle,
  Podcast,
  Search,
  BookAudio,
  ListMusic,
  Library,
  UserRound,
  Music2,
  Mic2,
  Info,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { playlists } from "@/data/playlists";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const router = useRouter();

  const isActiveLink = (href: string) => {
    return router.pathname === href;
  };

  return (
    <>
      <div
        onClick={toggleSidebar}
        className="fixed md:hidden inset-0 bg-black opacity-50 z-50"
      ></div>
      <div className="text-white block max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:top-10 max-md:z-50 border-r-2 w-52 bg-gray-900">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="flex-nowrap flex-col space-y-2 text-white">
            <Link
              href="#"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("#") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Search className="w-5 h-5" />
              Search
            </Link>
            <Link
              href="/golive"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("/golive") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Podcast className="w-5 h-5" />
              Go Live
            </Link>
            <Link
              href="/addaudio"
              className={`w-full gap-1 flex items-center justify-start hover:text-pink-600 ${
                isActiveLink("/addaudio") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              Add&nbsp;
              <Podcast className="w-5 h-5" />
              <BookAudio className="w-5 h-5" />
            </Link>
            <Link
              href="/youraudios"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("/youraudios") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <FolderTree className="w-5 h-5" />
              Your&nbsp;
              <Podcast className="w-5 h-5" />
              <BookAudio className="w-5 h-5" />
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
              href="/songs"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("/songs") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Music2 className="w-5 h-5" />
              Songs
            </Link>
            <Link
              href="/mfy"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("/mfy") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <UserRound className="w-5 h-5" />
              Made for You
            </Link>
            <Link
              href="/artists"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("/artists") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Mic2 className="w-5 h-5" />
              Artists
            </Link>
            <Link
              href="/albums"
              className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                isActiveLink("/albums") &&
                "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
              }`}
            >
              <Library className="w-5 h-5" />
              Albums
            </Link>
          </div>
        </div>
        <Separator />
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[280px] px-1">
            <div className="flex-nowrap flex-col space-y-1 p-2 text-white">
              {playlists?.map((playlist, i) => (
                <Link
                  href={`/${playlist}`}
                  key={`${playlist}-${i}`}
                  // value={playlist}
                  className={`w-full flex items-center justify-start gap-1 hover:text-pink-600 ${
                    isActiveLink(`/${playlist}`) &&
                    "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
                  }`}
                >
                  <ListMusic className="w-5 h-5" />
                  {playlist}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="py-2 px-3">
          <Link href="/about" className="gap-1 font-semibold flex items-center">
            <Info className="w-5 h-5" />
            About us
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
