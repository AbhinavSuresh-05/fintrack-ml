import { useEffect, useState } from "react";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/transactions")
      .then(res => setTransactions(res.data))
      .catch(err => {
        console.error(err);
        setTransactions([]);
      });
  }, []);

  const addTransaction = (t) => setTransactions(prev => [t, ...prev]);
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(p => p._id !== id));

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">FinTrack — Demo</h1>
        <TransactionForm onAdd={addTransaction} />
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>
    </div>
  );
}
