import { mockCases } from '../data/mockData';
import Navbar from '../components/Navbar';
import CaseTable from '../components/CaseTable';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cases Dashboard</h1>
          <p className="text-slate-400">Monitor and manage suspicious activity reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Total Cases</p>
            <p className="text-3xl font-bold text-white">{mockCases.length}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400">
              {mockCases.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-400">
              {mockCases.filter(c => c.status === 'approved').length}
            </p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Avg Risk Score</p>
            <p className="text-3xl font-bold text-red-400">
              {Math.round(
                mockCases.reduce((sum, c) => sum + c.riskScore, 0) / mockCases.length
              )}
            </p>
          </div>
        </div>

        {/* Cases Table */}
        <CaseTable cases={mockCases} />
      </main>
    </div>
  );
}
