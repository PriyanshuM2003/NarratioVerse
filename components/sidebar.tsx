"use client";
import React from "react";
import {
  FolderTree,
  PlusCircle,
  Podcast,
  Search,
  BookAudio,
  ListMusic,
  Mic2,
  Info,
  PlayCircle,
  Radio,
  BadgePlus,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { playlists } from "@/data/playlists";
import Link from "next/link";
import { useRouter } from "next/router";
interface LinkData {
  href: string;
  icon: JSX.Element;
  text: string;
}

const links: LinkData[] = [
  { href: "/", text: "Trending", icon: <PlayCircle className="w-5 h-5" /> },
  { href: "#", icon: <Search className="w-5 h-5" />, text: "Search" },
  {
    href: "/audiobooks",
    text: "Audio Books",
    icon: <BookAudio className="w-5 h-5" />,
  },
  {
    href: "/podcasts",
    text: "Podcasts",
    icon: <Podcast className="w-5 h-5" />,
  },
  { href: "/live", text: "Live", icon: <Radio className="w-5 h-5" /> },
  { href: "/new", text: "New", icon: <BadgePlus className="w-5 h-5" /> },
  { href: "/creators", icon: <Mic2 className="w-5 h-5" />, text: "Creators" },
  { href: "/golive", icon: <Radio className="w-5 h-5" />, text: "Go Live" },
  {
    href: "/addaudio",
    icon: (
      <>
        <PlusCircle className="w-5 h-5" />
      </>
    ),
    text: "Add Audio",
  },
  {
    href: "/youraudios",
    icon: (
      <>
        <FolderTree className="w-5 h-5" />
      </>
    ),
    text: "Your Audios",
  },
];
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
      <div className="text-white flex flex-col justify-between h-[calc(100ch-145px)] max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:top-10 max-md:z-50 border-r-2 border-t-2 w-52 bg-gray-900">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="flex-nowrap flex-col space-y-2 text-white">
            {links.map(({ href, icon, text }, index) => (
              <Link
                key={index}
                href={href}
                className={`w-full flex items-center gap-1 justify-start hover:text-pink-600 ${
                  isActiveLink(href) &&
                  "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
                }`}
              >
                {icon}
                {text}
              </Link>
            ))}
          </div>
        </div>
        <Separator />
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[250px] px-1">
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
