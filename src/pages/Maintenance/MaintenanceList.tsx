import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Car, 
  MoreHorizontal, 
  Check, 
  Calendar, 
  Settings, 
  Clock, 
  Wrench, 
  AlertTriangle 
} from 'lucide-react';
import { mockMaintenanceRecords, mockVehicles, mockServiceCenters } from '../../data/mockData';

interface GroupedMaintenance {
  [date: string]: typeof mockMaintenanceRecords;
}

const MaintenanceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterVehicle, setFilterVehicle] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  // Filter the maintenance records based on search term and filters
  const filteredRecords = mockMaintenanceRecords.filter(record => {
    const vehicle = mockVehicles.find(v => v.id === record.vehicleId);
    const serviceCenter = mockServiceCenters.find(sc => sc.id === record.serviceCenterId);
    
    const matchesSearch = 
      (vehicle ? vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (vehicle ? vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (serviceCenter ? serviceCenter.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      record.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus ? record.status === filterStatus : true;
    const matchesType = filterType ? record.maintenanceType === filterType : true;
    const matchesVehicle = filterVehicle ? record.vehicleId === filterVehicle : true;
    
    return matchesSearch && matchesStatus && matchesType && matchesVehicle;
  });

  // Group records by date for card view
  const groupedRecords = useMemo(() => {
    const grouped: GroupedMaintenance = {};
    
    filteredRecords.forEach(record => {
      // Use service date or fall back to current date for scheduled maintenance
      const date = record.serviceDate 
        ? record.serviceDate 
        : new Date().toISOString().split('T')[0];
        
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(record);
    });
    
    // Sort each day's records
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        // Sort by status first (scheduled first, then others)
        if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
        if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
        
        // Then sort by cost (higher first)
        return (b.cost || 0) - (a.cost || 0);
      });
    });
    
    return grouped;
  }, [filteredRecords]);

  // Sort dates for the cards
  const sortedDates = useMemo(() => {
    return Object.keys(groupedRecords).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [groupedRecords]);

  // Get vehicle plate number and model
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = mockVehicles.find(vehicle => vehicle.id === vehicleId);
    return vehicle 
      ? `${vehicle.plateNumber} - ${vehicle.model} (${vehicle.year})`
      : 'غير معروف';
  };

  // Get service center name
  const getServiceCenterName = (serviceCenterId: string) => {
    const serviceCenter = mockServiceCenters.find(sc => sc.id === serviceCenterId);
    return serviceCenter ? serviceCenter.name : 'غير معروف';
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">الصيانة</h1>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'cards' ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-gray-700 dark:bg-[#101010] dark:text-gray-300'}`}
            onClick={() => setViewMode('cards')}
          >
            بطاقات
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-gray-700 dark:bg-[#101010] dark:text-gray-300'}`}
            onClick={() => setViewMode('list')}
          >
            قائمة
          </button>
          <button className="btn btn-primary inline-flex items-center mr-2">
            <Plus className="w-4 h-4 ml-2" />
            إضافة سجل صيانة
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-bg rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 dark:bg-[#1a1a1a] dark:border-transparent"
              placeholder="البحث في سجلات الصيانة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTypeDropdown(false);
                setShowVehicleDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 ml-2" />
                <span>{filterStatus ? `الحالة: ${filterStatus === 'completed' ? 'مكتملة' : filterStatus === 'in-progress' ? 'قيد التنفيذ' : 'مجدولة'}` : 'تصفية حسب الحالة'}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showStatusDropdown && (
              <div className="absolute z-10 mt-1 w-full card-bg shadow-lg rounded-md py-1">
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus(null);
                    setShowStatusDropdown(false);
                  }}
                >
                  جميع الحالات
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('completed');
                    setShowStatusDropdown(false);
                  }}
                >
                  مكتملة
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('in-progress');
                    setShowStatusDropdown(false);
                  }}
                >
                  قيد التنفيذ
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('scheduled');
                    setShowStatusDropdown(false);
                  }}
                >
                  مجدولة
                </button>
              </div>
            )}
          </div>

          {/* Maintenance Type Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
                setShowVehicleDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 ml-2" />
                <span>{filterType ? `النوع: ${filterType === 'routine' ? 'صيانة دورية' : filterType === 'repair' ? 'إصلاح' : 'طارئة'}` : 'تصفية حسب نوع الصيانة'}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showTypeDropdown && (
              <div className="absolute z-10 mt-1 w-full card-bg shadow-lg rounded-md py-1">
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterType(null);
                    setShowTypeDropdown(false);
                  }}
                >
                  جميع الأنواع
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterType('routine');
                    setShowTypeDropdown(false);
                  }}
                >
                  صيانة دورية
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterType('repair');
                    setShowTypeDropdown(false);
                  }}
                >
                  إصلاح
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterType('emergency');
                    setShowTypeDropdown(false);
                  }}
                >
                  طارئة
                </button>
              </div>
            )}
          </div>

          {/* Vehicle Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowVehicleDropdown(!showVehicleDropdown);
                setShowStatusDropdown(false);
                setShowTypeDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Car className="h-5 w-5 text-gray-400 ml-2" />
                <span>
                  {filterVehicle 
                    ? `المركبة: ${mockVehicles.find(v => v.id === filterVehicle)?.plateNumber || 'غير معروف'}` 
                    : 'تصفية حسب المركبة'}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showVehicleDropdown && (
              <div className="absolute z-10 mt-1 w-full card-bg shadow-lg rounded-md py-1 max-h-60 overflow-y-auto">
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterVehicle(null);
                    setShowVehicleDropdown(false);
                  }}
                >
                  جميع المركبات
                </button>
                {mockVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                    onClick={() => {
                      setFilterVehicle(vehicle.id);
                      setShowVehicleDropdown(false);
                    }}
                  >
                    {vehicle.plateNumber} - {vehicle.model}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        /* Cards View */
        <div className="space-y-4">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <div key={date} className="card-bg rounded-lg shadow border-0 dark:border-0 overflow-hidden">
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 border-0 dark:border-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{formatDate(date)}</h3>
                </div>
                <div className="divide-y-0 divide-transparent dark:divide-transparent">
                  {groupedRecords[date].map(record => (
                    <div key={record.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center">
                            {record.maintenanceType === 'routine' ? (
                              <Settings className="h-7 w-7 text-gray-500 dark:text-gray-300" />
                            ) : (
                              <Wrench className="h-7 w-7 text-gray-500 dark:text-gray-300" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {record.description}
                                </span>
                                <div className="flex space-x-1 rtl:space-x-reverse">
                                  {renderStatusBadge(record.status)}
                                  {renderMaintenanceTypeBadge(record.maintenanceType)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-block ml-3">
                                <span className="font-medium">المركبة:</span> {getVehicleInfo(record.vehicleId)}
                              </span>
                              <span className="inline-block">
                                <span className="font-medium">مركز الخدمة:</span> {getServiceCenterName(record.serviceCenterId)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-block ml-3">
                                <span className="font-medium">التكلفة:</span> {formatCurrency(record.cost)}
                              </span>
                              <span className="inline-block ml-3">
                                <span className="font-medium">عداد المسافة:</span> {record.mileage ? `${record.mileage.toLocaleString()} كم` : 'غير محدد'}
                              </span>
                              {record.nextServiceDue && (
                                <span className="inline-block">
                                  <span className="font-medium">الصيانة القادمة:</span> {formatDate(record.nextServiceDue)}
                                </span>
                              )}
                            </div>
                            {record.notes && (
                              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">ملاحظات:</span> {record.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <Link
                            to={`/الصيانة/${record.id}`}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            عرض
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="card-bg rounded-lg shadow border-0 dark:border-0 p-6 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على سجلات صيانة</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                حاول تعديل معايير البحث أو التصفية.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="card-bg rounded-lg shadow border-0 dark:border-0">
          <div className="table-container">
            <table className="table dark:border-0">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-0 dark:border-0">
                <tr className="border-0 dark:border-0">
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    الوصف
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    المركبة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    التاريخ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    النوع
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    التكلفة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    الحالة
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">إجراءات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-0 divide-transparent dark:divide-transparent">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border-0 dark:border-0">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {record.description}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getServiceCenterName(record.serviceCenterId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getVehicleInfo(record.vehicleId)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {record.mileage ? `${record.mileage.toLocaleString()} كم` : 'غير محدد'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(record.serviceDate)}
                        </div>
                        {record.nextServiceDue && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            الصيانة القادمة: {formatDate(record.nextServiceDue)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderMaintenanceTypeBadge(record.maintenanceType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatCurrency(record.cost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <Link
                            to={`/الصيانة/${record.id}`}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 ml-3"
                          >
                            عرض
                          </Link>
                          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على سجلات صيانة</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        حاول تعديل معايير البحث أو التصفية.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;