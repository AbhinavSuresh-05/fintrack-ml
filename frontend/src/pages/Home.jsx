import { useEffect, useState } from "react";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/transactions");
      
      if (res.data.success) {
        setTransactions(res.data.data.transactions || []);
      } else {
        console.error('Failed to fetch transactions:', res.data.message);
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions([]);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions/stats");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    fetchStats(); // Refresh stats after adding
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t._id !== id));
    fetchStats(); // Refresh stats after deleting
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your transactions...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Track your expenses and let AI help you make better financial decisions.
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">↗</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${stats.income?.total?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold">↘</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${Math.abs(stats.expense?.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Net Worth</p>
                    <p className={`text-2xl font-bold ${
                      stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${stats.netWorth?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TransactionForm onAdd={addTransaction} />
            </div>
            <div className="lg:col-span-2">
              <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
