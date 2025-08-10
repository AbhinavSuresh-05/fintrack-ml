import { useState, useCallback, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import SpendingChart from "../components/dashboard/SpendingChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import MonthlyOverview from "../components/dashboard/MonthlyOverview";
import TransactionFilters from "../components/dashboard/TransactionFilters";
import ExportOptions from "../components/dashboard/ExportOptions";
import BudgetTracker from "../components/dashboard/BudgetTracker";
import { SkeletonCard, SkeletonChart, SkeletonTransactionList } from "../components/ui/LoadingSkeletons";
import KeyboardShortcuts from "../components/ui/KeyboardShortcuts";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import { useTransactions, useTransactionStats, useCreateTransaction, useDeleteTransaction } from "../hooks/useApi";

export default function Home() {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, analytics, budget, transactions
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { toggleTheme } = useTheme();

  // React Query hooks
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { data: stats, isLoading: statsLoading } = useTransactionStats();
  const createTransactionMutation = useCreateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  // Handle transaction creation
  const handleAddTransaction = useCallback(async (newTransaction) => {
    try {
      await createTransactionMutation.mutateAsync(newTransaction);
      showSuccess('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      showError('Failed to add transaction');
    }
  }, [createTransactionMutation, showSuccess, showError]);

  // Handle transaction deletion
  const handleDeleteTransaction = useCallback(async (transactionId) => {
    try {
      await deleteTransactionMutation.mutateAsync(transactionId);
      showSuccess('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showError('Failed to delete transaction');
    }
  }, [deleteTransactionMutation, showSuccess, showError]);

  // Update filtered transactions when transactions change
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleFilterTransactions = (filtered) => {
    setFilteredTransactions(filtered);
  };

  // Handlers for React Query mutations

  // Show loading state
  const isLoading = transactionsLoading || statsLoading;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your transactions...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (transactionsError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Error loading transactions. Please try again.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <KeyboardShortcuts 
        onAddTransaction={() => setActiveTab('transactions')}
        onToggleTheme={toggleTheme}
        onNavigateTab={setActiveTab}
      />
      <PWAInstallPrompt />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your expenses and let AI help you make better financial decisions.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide pb-2" aria-label="Tabs">
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
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 min-w-max`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-bold">↗</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${stats.income?.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 dark:text-red-400 font-bold">↘</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          ${Math.abs(stats.expense?.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">💰</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Worth</p>
                        <p className={`text-2xl font-bold ${
                          stats.netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          ${stats.netWorth?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              )}

              {/* Quick Action and Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <TransactionForm onAdd={handleAddTransaction} />
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                    {transactions.length > 0 ? (
                      <>
                        <TransactionList 
                          transactions={transactions.slice(0, 5)} 
                          onDelete={handleDeleteTransaction} 
                          showPagination={false}
                        />
                        {transactions.length > 5 && (
                          <div className="mt-4 text-center">
                            <button
                              onClick={() => setActiveTab('transactions')}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                            >
                              View all transactions →
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <SkeletonTransactionList count={3} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {transactions.length > 0 ? (
                  <>
                    <SpendingChart transactions={transactions} />
                    <CategoryChart transactions={transactions} />
                  </>
                ) : (
                  <>
                    <SkeletonChart />
                    <SkeletonChart />
                  </>
                )}
              </div>
              
              {transactions.length > 0 ? (
                <MonthlyOverview transactions={transactions} stats={stats} />
              ) : (
                <SkeletonChart />
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Additional analytics can go here */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">💡 Spending Insight</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
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
              
              <TransactionList 
                transactions={filteredTransactions} 
                onDelete={handleDeleteTransaction} 
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
