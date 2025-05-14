import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, Calendar, User, Car, MoreHorizontal, Clock, Check, X } from 'lucide-react';
import { mockTrips, mockDrivers, mockVehicles, mockDepartments } from '../../data/mockData';

interface GroupedTrips {
  [date: string]: typeof mockTrips;
}

const TripList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');

  // Filter the trips based on search term and filters
  const filteredTrips = mockTrips.filter(trip => {
    const vehicle = mockVehicles.find(v => v.id === trip.vehicleId);
    const driver = mockDrivers.find(d => d.id === trip.driverId);
    
    const matchesSearch = 
      (vehicle ? vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (driver ? driver.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      trip.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.endLocation ? trip.endLocation.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      trip.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus ? trip.status === filterStatus : true;
    const matchesDepartment = filterDepartment ? trip.departmentId === filterDepartment : true;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Group trips by date for timeline view
  const groupedTrips = useMemo(() => {
    const grouped: GroupedTrips = {};
    
    filteredTrips.forEach(trip => {
      const date = new Date(trip.startTime).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(trip);
    });
    
    // Sort each day's trips by start time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
    });
    
    return grouped;
  }, [filteredTrips]);

  // Sort dates for the timeline
  const sortedDates = useMemo(() => {
    return Object.keys(groupedTrips).sort();
  }, [groupedTrips]);

  // Get department name from ID
  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(dept => dept.id === departmentId);
    return department ? department.name : 'غير معروف';
  };

  // Get driver name
  const getDriverName = (driverId: string | null) => {
    if (!driverId) return 'غير مُعين';
    const driver = mockDrivers.find(driver => driver.id === driverId);
    return driver ? driver.name : 'غير معروف';
  };

  // Get vehicle plate number
  const getVehiclePlate = (vehicleId: string) => {
    const vehicle = mockVehicles.find(vehicle => vehicle.id === vehicleId);
    return vehicle ? vehicle.plateNumber : 'غير معروف';
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Format time from the ISO string
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('ar-AE', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  // Calculate trip duration
  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'جارية';
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes} دقيقة`;
    } else {
      return `${hours} ساعة ${minutes > 0 ? `و ${minutes} دقيقة` : ''}`;
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
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Clock className="w-3 h-3 ml-1" />
            جارية
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Calendar className="w-3 h-3 ml-1" />
            مجدولة
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <X className="w-3 h-3 ml-1" />
            ملغاة
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">الرحلات</h1>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'timeline' ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-gray-700 dark:bg-[#101010] dark:text-gray-300'}`}
            onClick={() => setViewMode('timeline')}
          >
            عرض زمني
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-gray-700 dark:bg-[#101010] dark:text-gray-300'}`}
            onClick={() => setViewMode('list')}
          >
            قائمة
          </button>
          <button className="btn btn-primary inline-flex items-center mr-2">
            <Plus className="w-4 h-4 ml-2" />
            إضافة رحلة
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-bg rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 dark:bg-[#1a1a1a] dark:border-transparent"
              placeholder="البحث عن رحلات..."
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
                setShowDepartmentDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 ml-2" />
                <span>{filterStatus ? `الحالة: ${filterStatus === 'completed' ? 'مكتملة' : filterStatus === 'in-progress' ? 'جارية' : filterStatus === 'scheduled' ? 'مجدولة' : 'ملغاة'}` : 'تصفية حسب الحالة'}</span>
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
                  جارية
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

          {/* Department Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowDepartmentDropdown(!showDepartmentDropdown);
                setShowStatusDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 ml-2" />
                <span>
                  {filterDepartment 
                    ? `القسم: ${getDepartmentName(filterDepartment)}` 
                    : 'تصفية حسب القسم'}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showDepartmentDropdown && (
              <div className="absolute z-10 mt-1 w-full card-bg shadow-lg rounded-md py-1">
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterDepartment(null);
                    setShowDepartmentDropdown(false);
                  }}
                >
                  جميع الأقسام
                </button>
                {mockDepartments.map((department) => (
                  <button
                    key={department.id}
                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                    onClick={() => {
                      setFilterDepartment(department.id);
                      setShowDepartmentDropdown(false);
                    }}
                  >
                    {department.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="space-y-4">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <div key={date} className="card-bg rounded-lg shadow border-0 dark:border-0 overflow-hidden">
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 border-0 dark:border-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{formatDate(date)}</h3>
                </div>
                <div className="divide-y-0 divide-transparent dark:divide-transparent">
                  {groupedTrips[date].map(trip => (
                    <div key={trip.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center">
                            <Car className="h-7 w-7 text-gray-500 dark:text-gray-300" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {trip.purpose}
                              </span>
                              {renderStatusBadge(trip.status)}
                            </div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-block ml-3">
                                <span className="font-medium">المركبة:</span> {getVehiclePlate(trip.vehicleId)}
                              </span>
                              <span className="inline-block ml-3">
                                <span className="font-medium">السائق:</span> {getDriverName(trip.driverId)}
                              </span>
                              <span className="inline-block">
                                <span className="font-medium">القسم:</span> {getDepartmentName(trip.departmentId)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-block ml-3">
                                <span className="font-medium">من:</span> {trip.startLocation}
                              </span>
                              <span className="inline-block">
                                <span className="font-medium">إلى:</span> {trip.endLocation || 'غير محدد'}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-block ml-3">
                                <span className="font-medium">الوقت:</span> {formatTime(trip.startTime)}
                              </span>
                              {trip.endTime && (
                                <span className="inline-block ml-3">
                                  <span className="font-medium">المدة:</span> {calculateDuration(trip.startTime, trip.endTime)}
                                </span>
                              )}
                              {trip.distance && (
                                <span className="inline-block">
                                  <span className="font-medium">المسافة:</span> {trip.distance} كم
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Link
                            to={`/الرحلات/${trip.id}`}
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
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على رحلات</h3>
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
                    الغرض
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    المركبة / السائق
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    التاريخ والوقت
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    المسار
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
                {filteredTrips.length > 0 ? (
                  filteredTrips.map(trip => (
                    <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border-0 dark:border-0">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {trip.purpose}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getDepartmentName(trip.departmentId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getVehiclePlate(trip.vehicleId)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getDriverName(trip.driverId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(trip.startTime.split('T')[0])}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(trip.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {trip.startLocation}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {trip.endLocation || 'غير محدد'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(trip.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <Link
                            to={`/الرحلات/${trip.id}`}
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
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على رحلات</h3>
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

export default TripList;