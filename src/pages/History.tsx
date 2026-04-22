import { useMemo, useState } from 'react';
import { mockSARReports, mockCases } from '../data/mockData';
import Navbar from '../components/Navbar';

export default function History() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = useMemo(() => {
    return mockSARReports.filter(report => {
      const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
      const matchesSearch =
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.caseId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-300';
      case 'rejected':
        return 'bg-red-900/30 text-red-300';
      case 'draft':
      default:
        return 'bg-slate-800/30 text-slate-300';
    }
  };

  const getCaseInfo = (caseId: string) => {
    return mockCases.find(c => c.id === caseId);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SAR History</h1>
          <p className="text-slate-400">View all filed and archived SAR reports</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-white">{mockSARReports.length}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-400">
              {mockSARReports.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Drafts</p>
            <p className="text-3xl font-bold text-slate-300">
              {mockSARReports.filter(r => r.status === 'draft').length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by SAR ID or Case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Reports Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-300">SAR ID</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-300">Case ID</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-300">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-300">Created</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-300">Approved By</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center px-6 py-8 text-slate-400">
                      No reports found
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const caseInfo = getCaseInfo(report.caseId);
                    return (
                      <tr key={report.id} className="table-row">
                        <td className="px-6 py-4 font-mono text-blue-400 text-sm">{report.id}</td>
                        <td className="px-6 py-4 font-mono text-slate-300 text-sm">{report.caseId}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{report.createdAt}</td>
                        <td className="px-6 py-4 text-slate-300">
                          {report.approvedBy ? (
                            <div>
                              <p className="text-sm font-medium">{report.approvedBy}</p>
                              <p className="text-xs text-slate-400">Compliance Officer</p>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button className="btn-secondary text-sm">
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reports Details */}
        {filteredReports.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Report Details</h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => {
                const caseInfo = getCaseInfo(report.caseId);
                return (
                  <details key={report.id} className="card group">
                    <summary className="cursor-pointer flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {report.id} - {report.caseId} ({caseInfo?.userName})
                      </span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                      <div className="max-h-96 overflow-y-auto bg-slate-800/30 rounded p-4">
                        <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                          {report.content}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-slate-400 mb-1">AI Confidence Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  report.aiConfidence >= 80
                                    ? 'bg-green-500'
                                    : report.aiConfidence >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${report.aiConfidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-300">
                              {report.aiConfidence}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Version</p>
                          <p className="text-sm font-semibold text-slate-300">v{report.version}</p>
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
