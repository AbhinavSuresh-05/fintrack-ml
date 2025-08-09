import axios from "axios";

export default function TransactionList({ transactions, onDelete, showPagination = true }) {
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
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500">Start by adding your first transaction above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <p className="text-sm text-gray-500">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {transactions.map((t) => (
          <div key={t._id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getCategoryIcon(t.category)}</span>
                  <h3 className="font-medium text-gray-900">{t.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {t.type}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-4">
                    <span>📅 {new Date(t.date).toLocaleDateString()}</span>
                    <span>🏷️ {t.category}</span>
                  </div>
                  {t.description && (
                    <p className="text-gray-600 italic">"{t.description}"</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className={`font-semibold text-lg ${getAmountColor(t.amount)}`}>
                  {formatAmount(t.amount)}
                </div>
                <button 
                  onClick={() => handleDelete(t._id)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
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
}
