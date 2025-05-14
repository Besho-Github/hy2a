import React, { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  children: ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ title, children }) => {
  return (
    <div className="card p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default DataCard;