import { create } from 'zustand';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Transaction {
  id?: string;
  amount: number;
  category: string;
  notes: string;
  type: 'income' | 'expense';
  date: Date;
  userId: string;
}

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  loading: false,
  
  fetchTransactions: async (userId: string) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Transaction[];
      
      set({ transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (transaction: Transaction) => {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        date: new Date(transaction.date)
      });
      
      set(state => ({
        transactions: [...state.transactions, { ...transaction, id: docRef.id }]
      }));
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  },

  deleteTransaction: async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== transactionId)
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },
}));