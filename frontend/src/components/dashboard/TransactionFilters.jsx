import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function TransactionFilters({ transactions, onFilter }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const [categories, setCategories] = useState([]);

  // Extract unique categories from transactions
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const uniqueCategories = [...new Set(transactions.map(t => t.category).filter(Boolean))];
      setCategories(uniqueCategories.sort());
    }
  }, [transactions]);

  // Apply filters whenever filters change
  useEffect(() => {
    if (!transactions) return;

    let filteredTransactions = [...transactions];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t =>
        t.description?.toLowerCase().includes(searchTerm) ||
        t.category?.toLowerCase().includes(searchTerm) ||
        t.amount.toString().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === filters.category);
    }

    // Type filter
    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }

    // Date range filter
    if (filters.dateFrom) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.date) <= new Date(filters.dateTo)
      );
    }

    // Amount range filter
    if (filters.amountMin) {
      filteredTransactions = filteredTransactions.filter(t => 
        Math.abs(t.amount) >= parseFloat(filters.amountMin)
      );
    }
    if (filters.amountMax) {
      filteredTransactions = filteredTransactions.filter(t => 
        Math.abs(t.amount) <= parseFloat(filters.amountMax)
      );
    }

    onFilter(filteredTransactions);
  }, [filters, transactions, onFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter Transactions</h3>
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by description, category, or amount..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date To
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Amount ($)
          </label>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={filters.amountMin}
            onChange={(e) => handleFilterChange('amountMin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Amount ($)
          </label>
          <input
            type="number"
            placeholder="10000.00"
            step="0.01"
            min="0"
            value={filters.amountMax}
            onChange={(e) => handleFilterChange('amountMax', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('dateFrom', format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Last 7 days
          </button>
          <button
            onClick={() => handleFilterChange('dateFrom', format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Last 30 days
          </button>
          <button
            onClick={() => handleFilterChange('type', 'income')}
            className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
          >
            Income only
          </button>
          <button
            onClick={() => handleFilterChange('type', 'expense')}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            Expenses only
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, amountMin: '100' }))}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            $100+
          </button>
        </div>
      </div>
    </div>
  );
}
