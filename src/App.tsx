import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignReview from "./pages/CampaignReview";
import EmergencySend from "./pages/EmergencySend";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import GrowList from "./pages/GrowList";
import Calendar from "./pages/Calendar";
import Onboarding from "./pages/Onboarding";
import JoinSignup from "./pages/JoinSignup";
import PricingPage from "./pages/Pricing";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/review/:id" element={<CampaignReview />} />
          <Route path="/campaigns/emergency" element={<EmergencySend />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/grow" element={<GrowList />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/join/:token" element={<JoinSignup />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
