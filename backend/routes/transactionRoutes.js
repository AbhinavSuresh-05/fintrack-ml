import express from "express";
import Transaction from "../models/Transaction.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @desc Get all user transactions with filtering and pagination
// @route GET /api/transactions
// @access Private
router.get("/", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            type,
            dateFrom,
            dateTo,
            sortBy = 'date',
            sortOrder = 'desc'
        } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            category,
            type,
            dateFrom,
            dateTo,
            sortBy,
            sortOrder
        };

        const transactions = await Transaction.getUserTransactions(req.user._id, options);
        
        // Get total count for pagination
        const totalQuery = { userId: req.user._id };
        if (category) totalQuery.category = category;
        if (type) totalQuery.type = type;
        if (dateFrom || dateTo) {
            totalQuery.date = {};
            if (dateFrom) totalQuery.date.$gte = new Date(dateFrom);
            if (dateTo) totalQuery.date.$lte = new Date(dateTo);
        }
        
        const total = await Transaction.countDocuments(totalQuery);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });
    } catch (err) {
        console.error('Get transactions error:', err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching transactions" 
        });
    }
});

// @desc Get transaction statistics
// @route GET /api/transactions/stats
// @access Private
router.get("/stats", async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        
        const stats = await Transaction.getUserStats(req.user._id, dateFrom, dateTo);
        
        // Format the stats
        const formattedStats = {
            income: { total: 0, count: 0, avgAmount: 0 },
            expense: { total: 0, count: 0, avgAmount: 0 }
        };

        stats.forEach(stat => {
            if (stat._id === 'income' || stat._id === 'expense') {
                formattedStats[stat._id] = {
                    total: stat.total,
                    count: stat.count,
                    avgAmount: stat.avgAmount
                };
            }
        });

        // Calculate net worth
        const netWorth = formattedStats.income.total + formattedStats.expense.total;

        res.json({
            success: true,
            data: {
                ...formattedStats,
                netWorth,
                totalTransactions: formattedStats.income.count + formattedStats.expense.count
            }
        });
    } catch (err) {
        console.error('Get stats error:', err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching transaction statistics" 
        });
    }
});

// @desc Add a new transaction
// @route POST /api/transactions
// @access Private
router.post("/", async (req, res) => {
    try {
        const { title, amount, category, description, type, date, tags, isRecurring, recurringFrequency } = req.body;

        // Validate required fields
        if (!title || amount === undefined || !category) {
            return res.status(400).json({ 
                success: false,
                message: "Title, amount, and category are required" 
            });
        }

        // Create transaction with user ID
        const transactionData = {
            title,
            amount: parseFloat(amount),
            category,
            userId: req.user._id,
            description,
            type: type || (parseFloat(amount) > 0 ? 'income' : 'expense'),
            date: date ? new Date(date) : new Date(),
            tags: tags || [],
            isRecurring: isRecurring || false,
            recurringFrequency
        };

        const newTransaction = new Transaction(transactionData);
        const savedTransaction = await newTransaction.save();
        
        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: savedTransaction
        });
    } catch (err) {
        console.error('Create transaction error:', err);
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Error creating transaction" 
        });
    }
});

// @desc Update a transaction
// @route PUT /api/transactions/:id
// @access Private
router.put("/:id", async (req, res) => {
    try {
        const { title, amount, category, description, type, date, tags, isRecurring, recurringFrequency } = req.body;

        // Find transaction and verify ownership
        const transaction = await Transaction.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!transaction) {
            return res.status(404).json({ 
                success: false,
                message: "Transaction not found" 
            });
        }

        // Update fields if provided
        if (title !== undefined) transaction.title = title;
        if (amount !== undefined) transaction.amount = parseFloat(amount);
        if (category !== undefined) transaction.category = category;
        if (description !== undefined) transaction.description = description;
        if (type !== undefined) transaction.type = type;
        if (date !== undefined) transaction.date = new Date(date);
        if (tags !== undefined) transaction.tags = tags;
        if (isRecurring !== undefined) transaction.isRecurring = isRecurring;
        if (recurringFrequency !== undefined) transaction.recurringFrequency = recurringFrequency;

        const updatedTransaction = await transaction.save();
        
        res.json({
            success: true,
            message: "Transaction updated successfully",
            data: updatedTransaction
        });
    } catch (err) {
        console.error('Update transaction error:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Error updating transaction" 
        });
    }
});

// @desc Delete a transaction
// @route DELETE /api/transactions/:id
// @access Private
router.delete("/:id", async (req, res) => {
    try {
        // Find and delete transaction, ensuring user ownership
        const deletedTransaction = await Transaction.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!deletedTransaction) {
            return res.status(404).json({ 
                success: false,
                message: "Transaction not found" 
            });
        }

        res.json({ 
            success: true,
            message: "Transaction deleted successfully" 
        });
    } catch (err) {
        console.error('Delete transaction error:', err);
        res.status(500).json({ 
            success: false,
            message: "Error deleting transaction" 
        });
    }
});

// @desc Get a single transaction
// @route GET /api/transactions/:id
// @access Private
router.get("/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!transaction) {
            return res.status(404).json({ 
                success: false,
                message: "Transaction not found" 
            });
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch (err) {
        console.error('Get transaction error:', err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching transaction" 
        });
    }
});

export default router;

