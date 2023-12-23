import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import "../styles/globals.css";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
      <TooltipProvider>
        <Toaster />
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Component {...pageProps} />
        <Footer />
      </TooltipProvider>
    </>
  );
}
export default MyApp;
