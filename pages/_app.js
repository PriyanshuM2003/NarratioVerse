import { useEffect, useState } from "react";
import "../styles/globals.css";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import LoadingBar from "react-top-loading-bar";
import { Dialog } from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(35);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast({
      description: "Logged out successfully",
    });
    router.push("/login");
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
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
        <Dialog>
          <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            toggleSidebar={handleToggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
          <div style={{ display: "flex" }}>
            {isSidebarVisible && (
              <Sidebar toggleSidebar={handleToggleSidebar} />
            )}
            <div style={{ flex: 1 }}>
              <Component {...pageProps} />
            </div>
          </div>
          <Footer />
        </Dialog>
      </TooltipProvider>
    </>
  );
}
export default MyApp;
