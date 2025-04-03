'use client';

import { useAuth } from '@/context/AuthContext';
import { useTransactionStore } from '@/store/transactionStore';
import AddTransaction from '@/components/AddTransaction';
import TransactionList from '@/components/TransactionList';
import AnalyticsGraph from '@/components/AnalyticsGraph';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { transactions } = useTransactionStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Financial Dashboard</h1>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Analytics Section */}
            <section>
              <AnalyticsGraph transactions={transactions} />
            </section>

            {/* Transactions Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
                <AddTransaction />
              </div>
              <TransactionList />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
