import { useEffect, useState } from "react";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import SpendingChart from "../components/dashboard/SpendingChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import MonthlyOverview from "../components/dashboard/MonthlyOverview";
import TransactionFilters from "../components/dashboard/TransactionFilters";
import ExportOptions from "../components/dashboard/ExportOptions";
import BudgetTracker from "../components/dashboard/BudgetTracker";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, analytics, budget, transactions
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

  // Initialize filtered transactions when transactions change
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    fetchStats(); // Refresh stats after adding
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t._id !== id));
    fetchStats(); // Refresh stats after deleting
  };

  const handleFilterTransactions = (filtered) => {
    setFilteredTransactions(filtered);
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Track your expenses and let AI help you make better financial decisions.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'analytics', name: 'Analytics', icon: '📈' },
                { id: 'budget', name: 'Budget', icon: '💰' },
                { id: 'transactions', name: 'Transactions', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Quick Action and Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <TransactionForm onAdd={addTransaction} />
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    <TransactionList 
                      transactions={transactions.slice(0, 5)} 
                      onDelete={deleteTransaction} 
                      showPagination={false}
                    />
                    {transactions.length > 5 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setActiveTab('transactions')}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View all transactions →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <SpendingChart transactions={transactions} />
                <CategoryChart transactions={transactions} />
              </div>
              
              <MonthlyOverview transactions={transactions} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Additional analytics can go here */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">💡 Spending Insight</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Your highest spending category this month is{' '}
                          {transactions.filter(t => t.type === 'expense').length > 0 && 
                            Object.entries(
                              transactions
                                .filter(t => t.type === 'expense')
                                .reduce((acc, t) => {
                                  const cat = t.category || 'Other';
                                  acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
                                  return acc;
                                }, {})
                            )
                            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
                          }.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <ExportOptions transactions={transactions} stats={stats} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-8">
              <BudgetTracker transactions={transactions} />
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-8">
              <TransactionFilters 
                transactions={transactions} 
                onFilter={handleFilterTransactions} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <TransactionForm onAdd={addTransaction} />
                </div>
                <div className="lg:col-span-3">
                  <TransactionList 
                    transactions={filteredTransactions} 
                    onDelete={deleteTransaction} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
