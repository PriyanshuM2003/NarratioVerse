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
  BadgeAlert,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useRouter } from "next/router";
import GetLoggedUserData from "@/routes/getLoggedUserData";
import JoinLiveRoom from "./liveRoom/joinLiveRoom";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import { Skeleton } from "./ui/skeleton";
import PlaylistDeleteAlert from "./dialogs/playlistDeleteAlert";

interface LinkData {
  href: string;
  icon: JSX.Element;
  text: string;
}

const commonLinks: LinkData[] = [
  { href: "/", text: "Trending", icon: <PlayCircle className="w-5 h-5" /> },
  { href: "/search", icon: <Search className="w-5 h-5" />, text: "Search" },
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
  { href: "/new", text: "New", icon: <BadgeAlert className="w-5 h-5" /> },
  { href: "/creators", icon: <Mic2 className="w-5 h-5" />, text: "Creators" },
];

const creatorLinks: LinkData[] = [
  { href: "/golive", icon: <Radio className="w-5 h-5" />, text: "Go Live" },
  {
    href: "/addaudio",
    icon: <PlusCircle className="w-5 h-5" />,
    text: "Add Audio",
  },
  {
    href: "/youraudios",
    icon: <FolderTree className="w-5 h-5" />,
    text: "Your Audios",
  },
];

interface SidebarProps {
  toggleSidebar: () => void;
  isLoggedIn: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar, isLoggedIn }) => {
  const { loggedUserData } = GetLoggedUserData();

  const { playlistsData, loadingPlaylistsData } = GetPlaylistsData();

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
            {commonLinks.map(({ href, icon, text }, index) => (
              <Link
                key={index}
                href={href}
                className={`w-full flex items-center gap-1 hover:text-pink-600 ${
                  isActiveLink(href) &&
                  "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
                }`}
              >
                {icon}
                {text}
              </Link>
            ))}
            {isLoggedIn && loggedUserData && loggedUserData.premium && (
              <>
                <JoinLiveRoom />
              </>
            )}
            {isLoggedIn && loggedUserData && loggedUserData.creator && (
              <>
                <JoinLiveRoom />
              </>
            )}
            {/* {isLoggedIn && loggedUserData && loggedUserData.creator && (
              <>
                {creatorLinks.map(({ href, icon, text }, index) => (
                  <Link
                    key={index}
                    href={href}
                    className={`w-full flex items-center gap-1 hover:text-pink-600 ${
                      isActiveLink(href) &&
                      "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
                    }`}
                  >
                    {icon}
                    {text}
                  </Link>
                ))}
              </>
            )} */}
          </div>
        </div>
        {isLoggedIn && (
          <>
            <Separator />
            <div className="py-2">
              <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                Playlists
              </h2>
              <ScrollArea className="h-[250px] px-1">
                <div className="flex-nowrap flex-col space-y-2 p-2 text-white">
                  {loadingPlaylistsData
                    ? Array.from({ length: 7 }, (_, index) => (
                        <Skeleton key={index} className="h-6" />
                      ))
                    : playlistsData?.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="flex items-center justify-between"
                        >
                          <Link
                            href={`/playlist/${playlist.name}`}
                            className={`w-full flex items-center gap-1 hover:text-pink-600 ${
                              isActiveLink(`/playlist/${playlist.name}`) &&
                              "rounded-sm px-2 py-1.5 font-semibold focus:bg-accent focus:text-accent-foreground overflow-hidden bg-popover text-popover-foreground shadow-lg"
                            }`}
                          >
                            <ListMusic className="w-5 h-5" />
                            {playlist.name}
                          </Link>
                          <PlaylistDeleteAlert playlistId={playlist.id} />
                        </div>
                      ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
        {isLoggedIn && <Separator />}
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
