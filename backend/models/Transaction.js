import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Transaction title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: { 
        type: Number, 
        required: [true, 'Transaction amount is required'],
        validate: {
            validator: function(value) {
                return value !== 0;
            },
            message: 'Amount cannot be zero'
        }
    },
    category: { 
        type: String, 
        required: [true, 'Transaction category is required'],
        trim: true,
        enum: {
            values: [
                'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
                'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
                'Income', 'Investment', 'Transfer', 'Other'
            ],
            message: 'Invalid category selected'
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense'],
        default: function() {
            return this.amount > 0 ? 'income' : 'expense';
        }
    },
    date: { 
        type: Date, 
        default: Date.now,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: function() {
            return this.isRecurring;
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

// Virtual for absolute amount (always positive)
transactionSchema.virtual('absoluteAmount').get(function() {
    return Math.abs(this.amount);
});

// Static method to get user's transactions with pagination
transactionSchema.statics.getUserTransactions = function(userId, options = {}) {
    const {
        page = 1,
        limit = 20,
        category,
        type,
        dateFrom,
        dateTo,
        sortBy = 'date',
        sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const query = { userId };

    // Add filters
    if (category) query.category = category;
    if (type) query.type = type;
    if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean();
};

// Static method to get user's transaction statistics
transactionSchema.statics.getUserStats = function(userId, dateFrom, dateTo) {
    const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
    
    if (dateFrom || dateTo) {
        matchStage.date = {};
        if (dateFrom) matchStage.date.$gte = new Date(dateFrom);
        if (dateTo) matchStage.date.$lte = new Date(dateTo);
    }

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
                avgAmount: { $avg: '$amount' }
            }
        }
    ]);
};

export default mongoose.model("Transaction", transactionSchema);
