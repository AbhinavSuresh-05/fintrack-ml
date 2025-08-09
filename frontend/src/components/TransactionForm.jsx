import { useState } from "react";
import axios from "axios";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) return alert("fill all fields");
    try {
      const res = await axios.post("http://localhost:5000/api/transactions", {
        title: form.title,
        amount: Number(form.amount),
        category: form.category
      });
      onAdd(res.data);
      setForm({ title: "", amount: "", category: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-4 flex gap-2">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 flex-1" />
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" type="number" className="border p-2 w-28" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 w-36" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}
