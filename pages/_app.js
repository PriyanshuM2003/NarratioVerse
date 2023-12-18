import Navbar from "@/components/Navbar";
import "../styles/globals.css";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {

    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      }
    }, []);
  
    const handleLogout = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        toast({
          description: "Logged out successfully",
        });
        router.push("/login");
      }
    };
  
  return (
    <>
      <TooltipProvider>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Component {...pageProps} />
        <Footer />
      </TooltipProvider>
    </>
  );
}
export default MyApp;
