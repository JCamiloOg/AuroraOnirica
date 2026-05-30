import { Toaster } from "sonner";
import AppRoutes from "./routes/appRoutes";
import "@/config/i18n";
import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: false,
      mirror: true,
      offset: 120
    });
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" duration={3000} toastOptions={{
        classNames: {
          default: "text-white! bg-[#262626]! border-[#3b3c3c]!",
        }
      }} />
    </>
  );
}

export default App;
