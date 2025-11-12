import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NGODashboard from "./pages/NGODashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import AuditProjects from "./pages/AuditProjects";
import ProjectForm from "./pages/ProjectForm";
import ProjectMonitoring from "./pages/ProjectMonitoring";
import ProjectDetails from "./pages/ProjectDetails";
import BlockchainMonitoring from "./pages/BlockchainMonitoring";
import CarbonMarketplace from "./pages/CarbonMarketplace";
import PublicView from "./pages/PublicView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/government-dashboard" element={<GovernmentDashboard />} />
          <Route path="/audit-projects" element={<AuditProjects />} />
          <Route path="/project-form" element={<ProjectForm />} />
          <Route path="/project-monitoring/:projectId" element={<ProjectMonitoring />} />
          <Route path="/project-details/:projectId" element={<ProjectDetails />} />
          <Route path="/blockchain-monitoring/:projectId" element={<BlockchainMonitoring />} />
          <Route path="/carbon-marketplace" element={<CarbonMarketplace />} />
          <Route path="/public-view" element={<PublicView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
