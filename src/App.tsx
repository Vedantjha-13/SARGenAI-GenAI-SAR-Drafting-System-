import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AuditLedger from "./pages/AuditLedger";
import CaseDetail from "./pages/CaseDetail";
import Dashboard from "./pages/Dashboard";
import EntityGraph from "./pages/EntityGraph";
import History from "./pages/History";
import IntelligenceFeed from "./pages/IntelligenceFeed";
import LoginPage from "./pages/LoginPage";
import ProfileDashboard from "./pages/ProfileDashboard";
import RiskMonitor from "./pages/RiskMonitor";
import SARReport from "./pages/SARReport";
import SARReview from "./pages/SARReview";
import SystemSettings from "./pages/SystemSettings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/intelligence-feed" element={<IntelligenceFeed />} />
            <Route path="/sar-review" element={<SARReview />} />
            <Route path="/entity-graph" element={<EntityGraph />} />
            <Route path="/case-detail" element={<Navigate replace to="/dashboard" />} />
            <Route path="/case/:id" element={<CaseDetail />} />
            <Route path="/audit-ledger" element={<AuditLedger />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/history" element={<History />} />
            <Route path="/risk-monitor" element={<RiskMonitor />} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/sar-report" element={<SARReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
