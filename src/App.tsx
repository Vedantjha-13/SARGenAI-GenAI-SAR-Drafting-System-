import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import CaseDetail from './pages/CaseDetail';
import SARReview from './pages/SARReview';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case/:caseId" element={<CaseDetail />} />
        <Route path="/review/:caseId" element={<SARReview />} />
        <Route path="/history" element={<History />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
