import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
];

export default function CategoryChart({ transactions }) {
  const [chartType, setChartType] = useState('expenses'); // expenses or income

  const getCategoryData = () => {
    if (!transactions || transactions.length === 0) return [];

    const filteredTransactions = transactions.filter(t => t.type === chartType);
    
    const categoryTotals = {};
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      const amount = Math.abs(transaction.amount);
      
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    // Convert to array and sort by amount (descending)
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: 0 // Will be calculated after we have the total
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length]
      }));
  };

  const categoryData = getCategoryData();
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages
  const dataWithPercentages = categoryData.map(item => ({
    ...item,
    percentage: total > 0 ? (item.value / total * 100).toFixed(1) : 0
  }));

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-semibold">${data.value.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-semibold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {chartType === 'expenses' ? 'Spending' : 'Income'} by Category
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('expenses')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              chartType === 'expenses'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setChartType('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              chartType === 'income'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {dataWithPercentages.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No {chartType} data</p>
            <p className="text-sm">Add some {chartType} transactions to see the breakdown</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center">
          {/* Pie Chart */}
          <div className="h-64 w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercentages}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dataWithPercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-full lg:w-1/2 lg:pl-6 mt-4 lg:mt-0">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dataWithPercentages.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">${item.value.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            
            {total > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total {chartType}:</span>
                  <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
