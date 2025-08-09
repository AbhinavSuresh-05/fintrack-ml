import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// @desc Get all transactions
router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Add a new transaction
router.post("/", async (req, res) => {
    const { title, amount, category } = req.body;

    if (!title || !amount || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newTransaction = new Transaction({ title, amount, category });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc Delete a transaction
router.delete("/:id", async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

