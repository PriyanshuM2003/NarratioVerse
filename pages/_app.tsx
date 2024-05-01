import { useEffect, useState } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import LoadingBar from "react-top-loading-bar";
import Sidebar from "@/components/sidebar";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import Layout from "@/components/player/layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SocketProvider } from "@/context/socket";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AppProps } from "next/app";
import Navbar from "@/components/navbar";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const routeChangeStartHandler = () => {
      setProgress(35);
    };

    const routeChangeCompleteHandler = () => {
      setProgress(100);
    };

    router.events.on("routeChangeStart", routeChangeStartHandler);
    router.events.on("routeChangeComplete", routeChangeCompleteHandler);

    return () => {
      router.events.off("routeChangeStart", routeChangeStartHandler);
      router.events.off("routeChangeComplete", routeChangeCompleteHandler);
    };
  }, [router.events]);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast({
      description: "Logged out successfully",
    });
    router.push("/login");
  };

  const handleToggleSidebar = (): void => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 768px)");

    const handleResize = (): void => {
      if (mediaQuery.matches) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    handleResize();

    mediaQuery.addListener(handleResize);

    return () => {
      mediaQuery.removeListener(handleResize);
    };
  }, []);

  return (
    <>
      <LoadingBar
        color="#03cafc"
        waitingTime={400}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Toaster />
      <TooltipProvider>
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          toggleSidebar={handleToggleSidebar}
          isSidebarVisible={isSidebarVisible}
        />
        <div style={{ display: "flex" }}>
          {isSidebarVisible && <Sidebar toggleSidebar={handleToggleSidebar} />}
          <div style={{ flex: 1 }}>
            <AudioPlayerProvider>
              <ScrollArea className="h-[calc(100vh-10px)]">
                <Layout>
                  <SocketProvider>
                    <Component {...pageProps} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
                  </SocketProvider>
                </Layout>
              </ScrollArea>
            </AudioPlayerProvider>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
