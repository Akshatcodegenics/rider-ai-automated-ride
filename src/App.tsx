
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import BookRide from "./pages/BookRide";
import DriverLogin from "./pages/DriverLogin";
import RiderLogin from "./pages/RiderLogin";
import DriverPanel from "./pages/DriverPanel";
import AIBooking from "./pages/AIBooking";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-ride" element={<BookRide />} />
            <Route path="/driver-login" element={<DriverLogin />} />
            <Route path="/rider-login" element={<RiderLogin />} />
            <Route path="/driver-panel" element={<DriverPanel />} />
            <Route path="/ai-booking" element={<AIBooking />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
