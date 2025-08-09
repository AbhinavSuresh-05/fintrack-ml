import { useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({ 
    title: "", 
    amount: "", 
    category: "",
    description: "",
    type: "expense"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  const categories = [
    'Food & Dining',
    'Transportation', 
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Income',
    'Investment',
    'Transfer',
    'Other'
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      showError("Please fill in all required fields");
      return;
    }

    const loadingToast = showLoading('Adding transaction...');
    setIsLoading(true);
    try {
      const transactionData = {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        description: form.description || '',
        type: form.type,
        date: new Date().toISOString()
      };

      const res = await axios.post("http://localhost:5000/api/transactions", transactionData);
      
      if (res.data.success) {
        onAdd(res.data.data);
        setForm({ 
          title: "", 
          amount: "", 
          category: "",
          description: "",
          type: "expense"
        });
        showSuccess("Transaction added successfully!");
      } else {
        showError("Failed to add transaction: " + res.data.message);
      }
    } catch (err) {
      console.error('Transaction error:', err);
      showError("Failed to add transaction: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
      dismiss(loadingToast);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Transaction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="e.g., Grocery shopping" 
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <input 
              name="amount" 
              value={form.amount} 
              onChange={handleChange} 
              placeholder="0.00" 
              type="number" 
              step="0.01"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Additional details about this transaction..."
            rows="2"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}
