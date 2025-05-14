import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Wrench, Car, MapPin, AlertTriangle, Settings, Clock, Check, FileText, DollarSign } from 'lucide-react';
import { mockMaintenanceRecords, mockVehicles, mockServiceCenters } from '../../data/mockData';

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceCenterId: string;
  description: string;
  maintenanceType: string;
  status: string;
  serviceDate: string | null;
  cost: number | null;
  mileage: number | null;
  nextServiceDue: string | null;
  notes: string | null;
}

const MaintenanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MaintenanceRecord | null>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with setTimeout
    const timer = setTimeout(() => {
      const foundRecord = mockMaintenanceRecords.find(r => r.id === id);
      setRecord(foundRecord || null);
      
      if (foundRecord) {
        const foundVehicle = mockVehicles.find(v => v.id === foundRecord.vehicleId);
        const foundServiceCenter = mockServiceCenters.find(sc => sc.id === foundRecord.serviceCenterId);
        setVehicle(foundVehicle || null);
        setServiceCenter(foundServiceCenter || null);
      }
      
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Format date to a more readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'غير محدد';
    return `${amount.toLocaleString()} درهم`;
  };

  // Render icon based on maintenance type
  const renderMaintenanceIcon = (type: string) => {
    switch (type) {
      case 'routine':
        return <Settings className="h-10 w-10 text-gray-500 dark:text-gray-300" />;
      case 'repair':
        return <Wrench className="h-10 w-10 text-gray-500 dark:text-gray-300" />;
      case 'emergency':
        return <AlertTriangle className="h-10 w-10 text-gray-500 dark:text-gray-300" />;
      default:
        return <Wrench className="h-10 w-10 text-gray-500 dark:text-gray-300" />;
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Check className="w-3 h-3 ml-1" />
            مكتملة
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Calendar className="w-3 h-3 ml-1" />
            مجدولة
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Clock className="w-3 h-3 ml-1" />
            قيد التنفيذ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  // Render maintenance type badge
  const renderMaintenanceTypeBadge = (type: string) => {
    switch (type) {
      case 'routine':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Settings className="w-3 h-3 ml-1" />
            صيانة دورية
          </span>
        );
      case 'repair':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Wrench className="w-3 h-3 ml-1" />
            إصلاح
          </span>
        );
      case 'emergency':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <AlertTriangle className="w-3 h-3 ml-1" />
            طارئة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            {type}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-300 dark:bg-[#2a2a2a] rounded mx-auto mb-4"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-[#1a1a1a] rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/الصيانة" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
            <ChevronLeft className="w-5 h-5 ml-1" />
            العودة إلى الصيانة
          </Link>
        </div>
        <div className="card-bg rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">لم يتم العثور على سجل الصيانة</h2>
          <p className="text-gray-600 dark:text-gray-400">عذراً، لم نتمكن من العثور على سجل الصيانة المطلوب.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Link to="/الصيانة" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
            <ChevronLeft className="w-5 h-5 ml-1" />
            العودة إلى الصيانة
          </Link>
        </div>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-[#2a2a2a]">
            طباعة
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-[#2a2a2a]">
            تعديل
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-16 w-16 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center mr-4">
              {renderMaintenanceIcon(record.maintenanceType)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{record.description}</h1>
              <div className="flex items-center mt-2 space-x-2 rtl:space-x-reverse">
                {renderStatusBadge(record.status)}
                {renderMaintenanceTypeBadge(record.maintenanceType)}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
                  <Calendar className="w-3 h-3 ml-1" />
                  {formatDate(record.serviceDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(record.cost)}</div>
            {record.status === 'scheduled' && (
              <button className="mt-2 px-3 py-1 rounded-md bg-[#333333] text-white dark:bg-[#1a1a1a] dark:text-gray-300 hover:bg-[#444444] dark:hover:bg-[#2a2a2a]">
                تحديث الحالة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Info */}
        <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">معلومات الخدمة</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">نوع الصيانة</div>
              <div className="mt-1 text-sm text-gray-900 dark:text-white">
                {record.maintenanceType === 'routine' ? 'صيانة دورية' : 
                 record.maintenanceType === 'repair' ? 'إصلاح' : 'طارئة'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">تاريخ الخدمة</div>
              <div className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(record.serviceDate)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</div>
              <div className="mt-1 text-sm text-gray-900 dark:text-white">
                {record.status === 'completed' ? 'مكتملة' : 
                 record.status === 'in-progress' ? 'قيد التنفيذ' : 'مجدولة'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">عداد المسافة</div>
              <div className="mt-1 text-sm text-gray-900 dark:text-white">
                {record.mileage ? `${record.mileage.toLocaleString()} كم` : 'غير محدد'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">موعد الصيانة القادمة</div>
              <div className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(record.nextServiceDue)}</div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">تفاصيل التكلفة</h2>
          {record.cost === null ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد تفاصيل للتكلفة متاحة.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">تكلفة قطع الغيار</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(record.cost * 0.6)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">أجور العمالة</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(record.cost * 0.3)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">رسوم إضافية</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(record.cost * 0.1)}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">المجموع</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(record.cost)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">معلومات المركبة</h2>
          {vehicle ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center">
                  <Car className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                </div>
                <div className="mr-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.plateNumber}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{vehicle.model} {vehicle.year}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">لون المركبة</div>
                <div className="mt-1 text-sm text-gray-900 dark:text-white">{vehicle.color}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">رقم الهيكل</div>
                <div className="mt-1 text-sm text-gray-900 dark:text-white">{vehicle.vin || 'غير متوفر'}</div>
              </div>
              <div>
                <Link 
                  to={`/المركبات/${vehicle.id}`}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  عرض تفاصيل المركبة
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">معلومات المركبة غير متوفرة.</div>
          )}
        </div>
      </div>

      {/* Service Center */}
      {serviceCenter && (
        <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">مركز الخدمة</h2>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center">
              <MapPin className="h-6 w-6 text-gray-500 dark:text-gray-300" />
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{serviceCenter.name}</div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{serviceCenter.address}</div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                الهاتف: {serviceCenter.phone || 'غير متوفر'}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ساعات العمل: {serviceCenter.hours || 'غير متوفر'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">ملاحظات</h2>
        {record.notes ? (
          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{record.notes}</div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد ملاحظات مسجلة.</div>
        )}
      </div>

      {/* Service History */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">سجل الصيانة</h2>
        {vehicle ? (
          <div className="flow-root">
            <ul className="divide-y-0 divide-transparent dark:divide-transparent">
              {mockMaintenanceRecords
                .filter(mr => mr.vehicleId === vehicle.id && mr.id !== record.id)
                .slice(0, 5)
                .map((historyRecord) => (
                  <li key={historyRecord.id} className="py-4">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        {historyRecord.maintenanceType === 'routine' ? (
                          <Settings className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                        ) : (
                          <Wrench className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {historyRecord.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(historyRecord.serviceDate)}
                        </p>
                      </div>
                      <div>
                        <Link
                          to={`/الصيانة/${historyRecord.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                        >
                          عرض
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
            {mockMaintenanceRecords.filter(mr => mr.vehicleId === vehicle.id).length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to={`/المركبات/${vehicle.id}/الصيانة`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                >
                  عرض كل سجلات الصيانة
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد سجلات صيانة سابقة.</div>
        )}
      </div>

      {/* Documents */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">المستندات</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">المستندات المرفقة بسجل الصيانة هذا.</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-[#1a1a1a]">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-500 dark:text-gray-300" />
              <div className="mr-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">فاتورة الصيانة</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">PDF، 2.4 ميجابايت</div>
              </div>
            </div>
            <div className="mt-2 flex">
              <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">تنزيل</button>
              <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mr-3">معاينة</button>
            </div>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-[#1a1a1a]">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-500 dark:text-gray-300" />
              <div className="mr-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">تقرير الفحص</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">PDF، 1.1 ميجابايت</div>
              </div>
            </div>
            <div className="mt-2 flex">
              <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">تنزيل</button>
              <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mr-3">معاينة</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails; 