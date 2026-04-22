import { Transaction } from '../data/mockData';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Transaction History</h3>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-sm text-blue-400">{transaction.id}</p>
                  {transaction.suspicious && (
                    <span className="badge-suspicious">Suspicious</span>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-2">{transaction.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>Type: {transaction.type}</span>
                  <span>Date: {transaction.date}</span>
                  <span>Location: {transaction.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-100">
                  {formatAmount(transaction.amount)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
