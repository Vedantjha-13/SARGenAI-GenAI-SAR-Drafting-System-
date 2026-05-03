import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CaseDetail from './pages/CaseDetail';
import SARReview from './pages/SARReview';
import History from './pages/History';
import IntelligenceFeed from './pages/IntelligenceFeed';
import EntityGraph from './pages/EntityGraph';
import AuditLedger from './pages/AuditLedger';
import SystemSettings from './pages/SystemSettings';
import RiskMonitor from './pages/RiskMonitor';
import ProfileDashboard from './pages/ProfileDashboard';
import SARReport from './pages/SARReport';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/intelligence-feed" element={<IntelligenceFeed />} />
        <Route path="/sar-review" element={<SARReview />} />
        <Route path="/entity-graph" element={<EntityGraph />} />
        <Route path="/case-detail" element={<CaseDetail />} />
        <Route path="/audit-ledger" element={<AuditLedger />} />
        <Route path="/system-settings" element={<SystemSettings />} />
        <Route path="/history" element={<History />} />
        <Route path="/risk-monitor" element={<RiskMonitor />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/sar-report" element={<SARReport />} />
      </Routes>
    </BrowserRouter>
  );
}
