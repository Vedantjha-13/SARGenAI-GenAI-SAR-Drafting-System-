import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SARCase } from '../data/mockData';

interface CaseTableProps {
  cases: SARCase[];
}

export default function CaseTable({ cases }: CaseTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'riskScore' | 'createdAt'>('riskScore');

  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases.filter(c => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'riskScore') {
        return b.riskScore - a.riskScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [cases, searchTerm, filterStatus, sortBy]);

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'badge-high';
    if (score >= 50) return 'badge-medium';
    return 'badge-low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-900/20';
      case 'rejected':
        return 'text-red-400 bg-red-900/20';
      case 'pending':
      default:
        return 'text-yellow-400 bg-yellow-900/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by Case ID, User ID, or Name..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="input-field"
        >
          <option value="riskScore">Sort by Risk Score</option>
          <option value="createdAt">Sort by Date</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left px-6 py-3 font-semibold text-slate-300">Case ID</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-300">User ID</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-300">User Name</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-300">Risk Score</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-300">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-8 text-slate-400">
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredAndSortedCases.map((caseItem) => (
                  <tr key={caseItem.id} className="table-row">
                    <td className="px-6 py-4 font-mono text-blue-400 text-sm">{caseItem.id}</td>
                    <td className="px-6 py-4 font-mono text-slate-300 text-sm">{caseItem.userId}</td>
                    <td className="px-6 py-4 text-slate-200">{caseItem.userName}</td>
                    <td className="px-6 py-4">
                      <div className={`${getRiskColor(caseItem.riskScore)} inline-block`}>
                        {caseItem.riskScore}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/case/${caseItem.id}`)}
                        className="btn-primary text-sm"
                      >
                        View Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <p className="text-sm text-slate-400">
        Showing {filteredAndSortedCases.length} of {cases.length} cases
      </p>
    </div>
  );
}
