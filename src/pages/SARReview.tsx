import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCases, mockSARReports } from '../data/mockData';
import Navbar from '../components/Navbar';
import SAREditor from '../components/SAREditor';
import ActionButtons from '../components/ActionButtons';

export default function SARReview() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const caseData = mockCases.find(c => c.id === caseId);
  const sarReport = mockSARReports.find(r => r.caseId === caseId);
  
  const [editorContent, setEditorContent] = useState(
    sarReport?.content || generateAISARContent(caseData)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);

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

  const handleApprove = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('SAR Report Approved! Redirecting to history...');
      navigate('/history');
    }, 1500);
  };

  const handleReject = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('SAR Report Rejected. Case returned for regeneration.');
      navigate(`/case/${caseId}`);
    }, 1500);
  };

  const handleSaveEdit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Draft saved successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/case/${caseId}`)}
            className="text-blue-400 hover:text-blue-300 mb-4 transition-colors text-sm"
          >
            ← Back to Case
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Review SAR Report</h1>
          <p className="text-slate-400">Case {caseId} • {caseData.userName}</p>
        </div>

        {/* Version Comparison Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowVersionComparison(!showVersionComparison)}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            {showVersionComparison ? '▼' : '▶'} {' '}
            View Version Comparison
          </button>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Transaction Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Summary</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded">
                  <p className="text-slate-400 text-sm mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-white">{caseData.transactions.length}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded">
                  <p className="text-slate-400 text-sm mb-1">Suspicious Transactions</p>
                  <p className="text-2xl font-bold text-red-400">
                    {caseData.transactions.filter(t => t.suspicious).length}
                  </p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded">
                  <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${caseData.transactions
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Key Suspicious Insights</h3>
              <ul className="space-y-2">
                {caseData.suspiciousPatterns.map((pattern, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-yellow-400 flex-shrink-0">◆</span>
                    <span className="text-sm text-slate-300">{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-3">Case Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Case ID:</span>
                  <span className="font-mono text-blue-400">{caseData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className={caseData.riskScore >= 75 ? 'text-red-400' : 'text-yellow-400'}>
                    {caseData.riskScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-slate-300">{caseData.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            <div className="card h-full">
              <SAREditor
                initialContent={editorContent}
                aiConfidence={sarReport?.aiConfidence || 82}
                onContentChange={setEditorContent}
              />
            </div>
          </div>
        </div>

        {/* Version Comparison */}
        {showVersionComparison && sarReport && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Version Comparison</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-300 mb-3">Original (AI Generated - v{sarReport.version})</h4>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{sarReport.content.substring(0, 500)}...</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-300 mb-3">Current Edit</h4>
                <div className="bg-slate-800/50 border border-slate-700 rounded p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{editorContent.substring(0, 500)}...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <div className="flex-1">
            <ActionButtons
              onApprove={handleApprove}
              onReject={handleReject}
              onSave={handleSaveEdit}
              isLoading={isLoading}
              size="lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate AI SAR Content
function generateAISARContent(caseData: any) {
  if (!caseData) return '';
  
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `SUSPICIOUS ACTIVITY REPORT (SAR)

Financial Institution: Global Trust Bank
Report Filed Date: ${formattedDate}

ACCOUNT INFORMATION:
Account Number: ${caseData.userId}
Account Holder: ${caseData.userName}
Account Type: ${caseData.accountType}
Risk Score: ${caseData.riskScore}

TRANSACTION SUMMARY:
Total Transactions Reviewed: ${caseData.transactions.length}
Suspicious Transactions Identified: ${caseData.transactions.filter((t: any) => t.suspicious).length}
Total Transaction Amount: $${caseData.transactions.reduce((sum: number, t: any) => sum + t.amount, 0).toLocaleString()}

DETAILED ANALYSIS:
${caseData.suspiciousPatterns.map((pattern: string) => `• ${pattern}`).join('\n')}

TRANSACTION DETAILS:
${caseData.transactions
  .filter((t: any) => t.suspicious)
  .map((t: any) => `- ${t.id}: $${t.amount.toLocaleString()} (${t.date}) - ${t.description}`)
  .join('\n')}

FILING RATIONALE:
Based on the analysis above, this activity meets the criteria for suspicious activity reporting due to:
1. Pattern of high-value transactions inconsistent with historical account behavior
2. Transfers to high-risk jurisdictions without clear business justification
3. Lack of supporting documentation for stated purposes
4. Account activity profile inconsistent with account type

RECOMMENDATIONS:
Further investigation and enhanced due diligence are recommended. Consider filing report with appropriate regulatory authorities.

STATUS: PENDING REVIEW

This report is generated by AI and requires human review and approval before filing.`;
}
