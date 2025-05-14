import React from 'react';
import { useParams } from 'react-router-dom';

const VehicleDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تفاصيل المركبة</h1>
      <div className="card-bg rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          عرض تفاصيل المركبة رقم: {id}
        </p>
      </div>
    </div>
  );
};

export default VehicleDetails;