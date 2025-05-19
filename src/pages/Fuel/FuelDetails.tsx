import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Droplet, Car, User, Calendar, DollarSign, Gauge } from 'lucide-react';
import { mockFuelRecords, mockVehicles, mockDrivers } from '../../data/mockData';

const FuelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const fuelRecord = mockFuelRecords.find(record => record.id === id);

  // If fuel record not found
  if (!fuelRecord) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/سجلات-الوقود" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
            <ArrowRight className="h-5 w-5 ml-2" />
            <span>العودة إلى سجلات الوقود</span>
          </Link>
        </div>
        <div className="card-bg rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">سجل غير موجود</h2>
          <p className="text-gray-600 dark:text-gray-400">سجل الوقود المطلوب غير موجود أو تم حذفه.</p>
        </div>
      </div>
    );
  }

  const vehicle = mockVehicles.find(v => v.id === fuelRecord.vehicleId);
  const driver = mockDrivers.find(d => d.id === fuelRecord.driverId);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Get fuel type in Arabic
  const getFuelTypeArabic = (fuelType: string) => {
    switch (fuelType) {
      case 'gasoline':
        return 'بنزين';
      case 'diesel':
        return 'ديزل';
      case 'electric':
        return 'كهربائي';
      case 'hybrid':
        return 'هجين';
      default:
        return fuelType;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/سجلات-الوقود" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
          <ArrowRight className="h-5 w-5 ml-2" />
          <span>العودة إلى سجلات الوقود</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تفاصيل سجل الوقود</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Information Card */}
        <div className="card-bg rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
            <Droplet className="h-6 w-6 ml-2" />
            معلومات التزود بالوقود
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">التاريخ</p>
              <p className="text-gray-900 dark:text-white">{formatDate(fuelRecord.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">كمية الوقود</p>
              <p className="text-gray-900 dark:text-white">{fuelRecord.fuelAmount.toFixed(1)} لتر</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">نوع الوقود</p>
              <p className="text-gray-900 dark:text-white">{getFuelTypeArabic(fuelRecord.fuelType)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">التكلفة</p>
              <p className="text-gray-900 dark:text-white">{fuelRecord.cost.toLocaleString()} درهم</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">محطة الوقود</p>
              <p className="text-gray-900 dark:text-white">{fuelRecord.stationName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">قراءة العداد</p>
              <p className="text-gray-900 dark:text-white">{fuelRecord.odometer.toLocaleString()} كم</p>
            </div>
          </div>

          {fuelRecord.notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ملاحظات</p>
              <p className="text-gray-900 dark:text-white">{fuelRecord.notes}</p>
            </div>
          )}
        </div>

        {/* Vehicle and Driver Information */}
        <div className="space-y-6">
          {/* Vehicle Information */}
          <div className="card-bg rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <Car className="h-6 w-6 ml-2" />
              المركبة
            </h2>
            {vehicle ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم اللوحة</p>
                  <Link 
                    to={`/المركبات/${vehicle.id}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {vehicle.plateNumber}
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الطراز</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">السنة</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">نوع الوقود المناسب</p>
                  <p className="text-gray-900 dark:text-white">{getFuelTypeArabic(vehicle.fuelType)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">معلومات المركبة غير متوفرة</p>
            )}
          </div>

          {/* Driver Information */}
          <div className="card-bg rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <User className="h-6 w-6 ml-2" />
              السائق
            </h2>
            {driver ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الاسم</p>
                  <Link 
                    to={`/السائقين/${driver.id}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {driver.name}
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم الهاتف</p>
                  <p className="text-gray-900 dark:text-white">{driver.contactNumber}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">معلومات السائق غير متوفرة</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 rtl:space-x-reverse">
        <button className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]">
          تعديل
        </button>
        <button className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]">
          طباعة
        </button>
      </div>
    </div>
  );
};

export default FuelDetails; 