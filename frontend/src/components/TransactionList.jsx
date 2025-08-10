import axios from "axios";
import { memo } from "react";

const TransactionList = memo(function TransactionList({ transactions, onDelete, showPagination = true }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      if (res.data.success) {
        onDelete(id);
        alert('Transaction deleted successfully!');
      } else {
        alert('Failed to delete transaction: ' + res.data.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const formatAmount = (amount) => {
    return amount >= 0 ? `+$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`;
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Income': '💰',
      'Investment': '📈',
      'Transfer': '↔️',
      'Other': '📝'
    };
    return icons[category] || '📝';
  };

  if (!transactions.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors">
        <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Start by adding your first transaction above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((t) => (
          <div key={t._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-lg">{getCategoryIcon(t.category)}</span>
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{t.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    t.type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {t.type}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span>📅 {new Date(t.date).toLocaleDateString()}</span>
                    <span>🏷️ {t.category}</span>
                  </div>
                  {t.description && (
                    <p className="text-gray-600 dark:text-gray-400 italic break-words">"{t.description}"</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:ml-4">
                <div className={`font-semibold text-lg ${getAmountColor(t.amount)}`}>
                  {formatAmount(t.amount)}
                </div>
                <button 
                  onClick={() => handleDelete(t._id)} 
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TransactionList;
