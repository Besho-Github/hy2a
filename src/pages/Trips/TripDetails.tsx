import React from 'react';

const TripDetails: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">تفاصيل الرحلة</h1>
      <div className="card-bg rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">سيتم عرض تفاصيل الرحلة هنا</p>
      </div>
    </div>
  );
};

export default TripDetails;