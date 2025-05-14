import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, Car, MoreHorizontal, Check, X, AlertTriangle } from 'lucide-react';
import { mockVehicles, mockDrivers, mockDepartments } from '../../data/mockData';

const VehicleList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  // Get the unique vehicle types
  const vehicleTypes = Array.from(new Set(mockVehicles.map(vehicle => vehicle.type)));

  // Filter the vehicles based on search term and filters
  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus ? vehicle.status === filterStatus : true;
    const matchesType = filterType ? vehicle.type === filterType : true;
    const matchesDepartment = filterDepartment ? vehicle.departmentId === filterDepartment : true;
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment;
  });

  // Get department name from ID
  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(dept => dept.id === departmentId);
    return department ? department.name : 'غير معروف';
  };

  // Get assigned driver name
  const getDriverName = (driverId: string | null) => {
    if (!driverId) return 'غير مُعين';
    const driver = mockDrivers.find(driver => driver.id === driverId);
    return driver ? driver.name : 'غير معروف';
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <Check className="w-3 h-3 mr-1" />
            نشط
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            صيانة
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-gray-300">
            <X className="w-3 h-3 mr-1" />
            غير نشط
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">المركبات</h1>
        <button className="btn btn-primary inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          إضافة مركبة
        </button>
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
              placeholder="البحث عن مركبات..."
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
                setShowDepartmentDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span>{filterStatus ? `الحالة: ${filterStatus === 'active' ? 'نشط' : filterStatus === 'maintenance' ? 'صيانة' : 'غير نشط'}` : 'تصفية حسب الحالة'}</span>
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
                    setFilterStatus('active');
                    setShowStatusDropdown(false);
                  }}
                >
                  نشط
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('maintenance');
                    setShowStatusDropdown(false);
                  }}
                >
                  صيانة
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('inactive');
                    setShowStatusDropdown(false);
                  }}
                >
                  غير نشط
                </button>
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
                setShowDepartmentDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Car className="h-5 w-5 text-gray-400 mr-2" />
                <span>{filterType ? `النوع: ${filterType}` : 'تصفية حسب النوع'}</span>
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
                {vehicleTypes.map((type) => (
                  <button
                    key={type}
                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                    onClick={() => {
                      setFilterType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
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
                setShowTypeDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
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

      {/* Vehicle List */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0">
        <div className="table-container">
          <table className="table dark:border-0">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-0 dark:border-0">
              <tr className="border-0 dark:border-0">
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  المركبة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  النوع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  القسم
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  السائق المعين
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  المسافة المقطوعة
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">إجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-0 divide-transparent dark:divide-transparent">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border-0 dark:border-0">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center">
                        <Car className="h-7 w-7 text-gray-500 dark:text-gray-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.plateNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {vehicle.model} ({vehicle.year})
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(vehicle.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getDepartmentName(vehicle.departmentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getDriverName(vehicle.assignedDriver)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {vehicle.currentMileage.toLocaleString()} كم
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
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
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على مركبات</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              حاول تعديل معايير البحث أو التصفية.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;