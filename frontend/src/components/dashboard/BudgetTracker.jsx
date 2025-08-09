import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function BudgetTracker({ transactions }) {
  const [budgets, setBudgets] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Default budget categories
  const defaultCategories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Other'
  ];

  // Load budgets from localStorage on component mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem('fintrack-budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem('fintrack-budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Calculate spending for current month by category
  const getMonthlySpending = () => {
    if (!transactions || transactions.length === 0) return {};

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && 
             transactionDate <= monthEnd && 
             t.type === 'expense';
    });

    const spending = {};
    monthlyTransactions.forEach(t => {
      const category = t.category || 'Other';
      spending[category] = (spending[category] || 0) + Math.abs(t.amount);
    });

    return spending;
  };

  const monthlySpending = getMonthlySpending();
  const totalSpent = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);
  const totalBudget = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);

  const setBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(amount) || 0
    }));
  };

  const getBudgetStatus = (category, spent, budget) => {
    if (!budget) return { status: 'no-budget', percentage: 0 };
    
    const percentage = (spent / budget) * 100;
    let status = 'good';
    
    if (percentage >= 100) status = 'over';
    else if (percentage >= 80) status = 'warning';
    
    return { status, percentage };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'over': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-700';
      case 'warning': return 'text-yellow-700';
      case 'over': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  // Get all categories (from transactions + default categories)
  const allCategories = [...new Set([
    ...defaultCategories,
    ...Object.keys(monthlySpending),
    ...Object.keys(budgets)
  ])].sort();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Budget Tracker</h3>
          <p className="text-sm text-gray-600">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isEditing 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isEditing ? 'Done' : 'Edit Budgets'}
          </button>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Total Monthly Budget</span>
          <span className="text-lg font-bold text-gray-900">${totalBudget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Total Spent</span>
          <span className={`text-lg font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
            ${totalSpent.toFixed(2)}
          </span>
        </div>
        {totalBudget > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                totalSpent > totalBudget ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            ></div>
          </div>
        )}
        <div className="text-xs text-gray-600 mt-2">
          {totalBudget > 0 ? (
            <span>
              ${(totalBudget - totalSpent).toFixed(2)} {totalSpent > totalBudget ? 'over budget' : 'remaining'}
            </span>
          ) : (
            <span>Set budgets to track your spending</span>
          )}
        </div>
      </div>

      {/* Category Budgets */}
      <div className="space-y-4">
        {allCategories.map(category => {
          const spent = monthlySpending[category] || 0;
          const budget = budgets[category] || 0;
          const { status, percentage } = getBudgetStatus(category, spent, budget);

          return (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{category}</h4>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={budget || ''}
                      onChange={(e) => setBudget(category, e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">
                    ${spent.toFixed(2)} / ${budget.toFixed(2)}
                  </span>
                )}
              </div>

              {budget > 0 && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(status)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={getStatusTextColor(status)}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className="text-gray-600">
                      ${(budget - spent).toFixed(2)} {spent > budget ? 'over' : 'left'}
                    </span>
                  </div>
                </>
              )}

              {budget === 0 && !isEditing && (
                <p className="text-xs text-gray-500 italic">No budget set</p>
              )}
            </div>
          );
        })}
      </div>

      {allCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-medium">No spending data available</p>
          <p className="text-sm">Add some expense transactions to start tracking your budget</p>
        </div>
      )}
    </div>
  );
}
