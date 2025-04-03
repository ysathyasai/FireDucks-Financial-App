import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTransactionStore, Transaction } from '@/store/transactionStore';
import { format } from 'date-fns';

export default function TransactionList() {
  const { user } = useAuth();
  const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactionStore();

  useEffect(() => {
    if (user) {
      fetchTransactions(user.uid);
    }
  }, [user, fetchTransactions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: 'bg-blue-100 text-blue-800',
      Rent: 'bg-purple-100 text-purple-800',
      Salary: 'bg-green-100 text-green-800',
      Shopping: 'bg-yellow-100 text-yellow-800',
      Entertainment: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
    
    return (
      <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
        {type === 'income' ? '+' : '-'}{formatted}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {transactions.map((transaction: Transaction) => (
          <li key={transaction.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
                <p className="ml-4 text-sm font-medium text-gray-900">
                  {transaction.notes || 'No description'}
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-semibold">
                  {formatAmount(transaction.amount, transaction.type)}
                </p>
                <button
                  onClick={() => transaction.id && deleteTransaction(transaction.id)}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {format(transaction.date, 'MMM dd, yyyy')}
              </p>
            </div>
          </li>
        ))}
        {transactions.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            No transactions found. Add one to get started!
          </li>
        )}
      </ul>
    </div>
  );
}