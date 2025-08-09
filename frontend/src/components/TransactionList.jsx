import axios from "axios";

export default function TransactionList({ transactions, onDelete }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      onDelete(id);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (!transactions.length) return <div className="bg-white p-4 rounded shadow">No transactions yet.</div>;

  return (
    <div className="bg-white rounded shadow divide-y">
      {transactions.map((t) => (
        <div key={t._id} className="flex justify-between items-center p-3">
          <div>
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-slate-500">{new Date(t.date).toLocaleString()} • {t.category}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-semibold">₹{t.amount}</div>
            <button onClick={() => handleDelete(t._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
