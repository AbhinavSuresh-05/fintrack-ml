import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useState, useEffect } from 'react';

export default function MonthlyOverview({ transactions }) {
  const [chartData, setChartData] = useState([]);
  const [monthsToShow, setMonthsToShow] = useState(6);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    const generateMonthlyData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = endOfMonth(subMonths(now, i));
        
        const monthTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        });

        let income = 0;
        let expenses = 0;

        monthTransactions.forEach(t => {
          if (t.type === 'income') {
            income += t.amount;
          } else {
            expenses += Math.abs(t.amount);
          }
        });

        const net = income - expenses;

        data.push({
          month: format(monthStart, 'MMM yyyy'),
          income: income,
          expenses: expenses,
          net: net,
          shortMonth: format(monthStart, 'MMM')
        });
      }

      return data;
    };

    setChartData(generateMonthlyData());
  }, [transactions, monthsToShow]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  const totalIncome = chartData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = chartData.reduce((sum, month) => sum + month.expenses, 0);
  const totalNet = totalIncome - totalExpenses;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
        <select
          value={monthsToShow}
          onChange={(e) => setMonthsToShow(Number(e.target.value))}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Total Income</p>
          <p className="text-xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-xl font-bold text-red-700">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Net</p>
          <p className={`text-xl font-bold ${totalNet >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            ${totalNet.toFixed(2)}
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Add some transactions to see your monthly overview</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="shortMonth" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="income" 
                fill="#10b981" 
                name="Income"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="#ef4444" 
                name="Expenses"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Breakdown */}
      {chartData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Breakdown</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {chartData.map((month, index) => (
              <div key={index} className="flex justify-between items-center py-1 text-sm">
                <span className="text-gray-600">{month.month}</span>
                <div className="flex space-x-4">
                  <span className="text-green-600">+${month.income.toFixed(2)}</span>
                  <span className="text-red-600">-${month.expenses.toFixed(2)}</span>
                  <span className={`font-medium ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${month.net >= 0 ? '+' : ''}${month.net.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
