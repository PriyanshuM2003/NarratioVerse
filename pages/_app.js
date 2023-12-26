import { useEffect, useState } from "react";
import "../styles/globals.css";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import LoadingBar from "react-top-loading-bar";
import { Dialog } from "@/components/ui/dialog";
import { Menu } from "@/components/menu";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);

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
          <Menu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <Component {...pageProps} />
          <Footer />
        </Dialog>
      </TooltipProvider>
    </>
  );
}
export default MyApp;
