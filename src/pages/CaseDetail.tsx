import { useParams, useNavigate } from 'react-router-dom';
import { mockCases } from '../data/mockData';
import Navbar from '../components/Navbar';
import TransactionList from '../components/TransactionList';

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const caseData = mockCases.find(c => c.id === caseId);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-400">Case not found</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-400 hover:text-blue-300 mb-6 transition-colors text-sm"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Case {caseData.id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">User Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">User ID</p>
                  <p className="font-mono text-blue-400">{caseData.userId}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Name</p>
                  <p className="text-slate-100">{caseData.userName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-slate-300 break-all">{caseData.userEmail}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Account Type</p>
                  <p className="text-slate-100">{caseData.accountType}</p>
                </div>
              </div>
            </div>

            {/* Risk Score Card */}
            <div className="card">
              <p className="text-slate-400 text-sm mb-2">Risk Score</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        caseData.riskScore >= 75
                          ? 'bg-red-500'
                          : caseData.riskScore >= 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${caseData.riskScore}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">{caseData.riskScore}</span>
              </div>
            </div>

            {/* Status Card */}
            <div className="card">
              <p className="text-slate-400 text-sm mb-2">Status</p>
              <div className={`px-4 py-2 rounded-lg text-center font-semibold ${
                caseData.status === 'approved'
                  ? 'bg-green-900/30 text-green-300'
                  : caseData.status === 'rejected'
                  ? 'bg-red-900/30 text-red-300'
                  : 'bg-yellow-900/30 text-yellow-300'
              }`}>
                {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Description */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-3">Case Description</h3>
              <p className="text-slate-300 leading-relaxed">{caseData.description}</p>
            </div>

            {/* Suspicious Patterns */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-3">Suspicious Patterns Identified</h3>
              <ul className="space-y-2">
                {caseData.suspiciousPatterns.map((pattern, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-red-400 flex-shrink-0 mt-1">⚠</span>
                    <span className="text-slate-300">{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transactions */}
            <div className="card">
              <TransactionList transactions={caseData.transactions} />
            </div>

            {/* Action Button */}
            {caseData.status === 'pending' && (
              <button
                onClick={() => navigate(`/review/${caseData.id}`)}
                className="btn-primary w-full py-3 text-lg"
              >
                Generate SAR
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
