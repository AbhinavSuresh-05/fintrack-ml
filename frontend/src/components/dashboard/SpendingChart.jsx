import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';

export default function SpendingChart({ transactions }) {
  const [timeframe, setTimeframe] = useState('30days'); // 30days, 3months, 6months, 1year
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    const generateChartData = () => {
      const now = new Date();
      let startDate, dateFormat, groupBy;

      switch (timeframe) {
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFormat = 'MMM dd';
          groupBy = 'day';
          break;
        case '3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          dateFormat = 'MMM dd';
          groupBy = 'week';
          break;
        case '6months':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          dateFormat = 'MMM yyyy';
          groupBy = 'month';
          break;
        case '1year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          dateFormat = 'MMM yyyy';
          groupBy = 'month';
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFormat = 'MMM dd';
          groupBy = 'day';
      }

      // Filter transactions within the timeframe
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= now;
      });

      // Group transactions by time period
      const grouped = {};
      
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        let key;

        if (groupBy === 'day') {
          key = format(date, 'yyyy-MM-dd');
        } else if (groupBy === 'week') {
          // Group by week start (Monday)
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay() + 1);
          key = format(startOfWeek, 'yyyy-MM-dd');
        } else {
          // Group by month
          key = format(startOfMonth(date), 'yyyy-MM-dd');
        }

        if (!grouped[key]) {
          grouped[key] = { income: 0, expenses: 0, net: 0 };
        }

        if (transaction.type === 'income') {
          grouped[key].income += transaction.amount;
        } else {
          grouped[key].expenses += Math.abs(transaction.amount);
        }
        grouped[key].net = grouped[key].income - grouped[key].expenses;
      });

      // Convert to array and sort by date
      const data = Object.entries(grouped)
        .map(([date, values]) => ({
          date,
          formattedDate: format(new Date(date), dateFormat),
          ...values
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return data;
    };

    setChartData(generateChartData());
  }, [transactions, timeframe]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Trends</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Add some transactions to see your spending trends</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Income"
                dot={{ fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Expenses"
                dot={{ fill: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Net"
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
