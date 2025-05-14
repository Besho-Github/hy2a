import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend = 'neutral', 
  trendValue, 
  color = 'primary' 
}) => {
  // Color mappings
  const colorClasses = {
    primary: 'bg-gray-200 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400',
    secondary: 'bg-gray-100 text-gray-500 dark:bg-gray-700/30 dark:text-gray-400',
    accent: 'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-500',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    error: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  };

  // Trend indicator
  const renderTrendIndicator = () => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center text-red-600 dark:text-red-400">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Minus className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">لا يوجد تغيير</span>
        </div>
      );
    }
  };

  return (
    <div className="card p-4 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {renderTrendIndicator()}
      </div>
    </div>
  );
};

export default StatCard;