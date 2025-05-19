import React, { useState, useEffect } from 'react';
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
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vin: '',
    status: 'active',
    fuelType: 'gasoline',
    currentMileage: 0,
    assignedDriver: '',
    lastServiceDate: '',
    nextServiceDue: '',
    registrationExpiry: '',
    insuranceExpiry: '',
    departmentId: ''
  });

  // Add custom styling for date inputs
  useEffect(() => {
    // Add a style tag to the document head
    const style = document.createElement('style');
    style.innerHTML = `
      .date-input::-webkit-calendar-picker-indicator {
        filter: invert(1) brightness(100%);
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style tag when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new vehicle entry (in a real app, this would be sent to an API)
    const newVehicle = {
      id: `vehicle-${Date.now()}`,
      ...formData,
      currentMileage: Number(formData.currentMileage),
      year: Number(formData.year),
      assignedDriver: formData.assignedDriver || null,
      lastLocation: { lat: 24.4539, lng: 54.3773 }, // Default location
    };
    
    console.log('New vehicle:', newVehicle);
    
    // In a real application, you would add this to your vehicles state or send to an API
    // For now, just reset the form and close the modal
    setFormData({
      plateNumber: '',
      type: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      vin: '',
      status: 'active',
      fuelType: 'gasoline',
      currentMileage: 0,
      assignedDriver: '',
      lastServiceDate: '',
      nextServiceDue: '',
      registrationExpiry: '',
      insuranceExpiry: '',
      departmentId: ''
    });
    
    setShowAddVehicleForm(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('تم إضافة المركبة بنجاح');
  };

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
        <button 
          className="btn bg-[#101010] text-white hover:bg-[#252525] inline-flex items-center dark:bg-[#101010] dark:hover:bg-[#252525]"
          onClick={() => setShowAddVehicleForm(true)}
        >
          <Plus className="w-4 h-4 ml-2 text-white" />
          إضافة مركبة
        </button>
      </div>

      {/* Add Vehicle Form Modal */}
      {showAddVehicleForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={() => setShowAddVehicleForm(false)}
          >
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-[#0f0f0f] opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom card-bg rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6 dark:bg-[#101010]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setShowAddVehicleForm(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">إضافة مركبة جديدة</h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Plate Number */}
                  <div>
                    <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      رقم اللوحة
                    </label>
                    <input
                      type="text"
                      id="plateNumber"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="مثال: AB-1234"
                      required
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* VIN */}
                  <div>
                    <label htmlFor="vin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      رقم الهيكل (VIN)
                    </label>
                    <input
                      type="text"
                      id="vin"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="مثال: JT2BF12K1W0123456"
                      required
                      value={formData.vin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Model */}
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الطراز
                    </label>
                    <input
                      type="text"
                      id="model"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="مثال: Toyota Camry"
                      required
                      value={formData.model}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      النوع
                    </label>
                    <select
                      id="type"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">اختر النوع</option>
                      <option value="sedan">سيدان</option>
                      <option value="SUV">دفع رباعي</option>
                      <option value="bus">حافلة</option>
                      <option value="truck">شاحنة</option>
                      <option value="van">شاحنة صغيرة</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Year */}
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      سنة الصنع
                    </label>
                    <input
                      type="number"
                      id="year"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      required
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      اللون
                    </label>
                    <input
                      type="text"
                      id="color"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="مثال: أبيض"
                      required
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الحالة
                    </label>
                    <select
                      id="status"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      required
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">نشط</option>
                      <option value="maintenance">صيانة</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نوع الوقود
                    </label>
                    <select
                      id="fuelType"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      required
                      value={formData.fuelType}
                      onChange={handleInputChange}
                    >
                      <option value="gasoline">بنزين</option>
                      <option value="diesel">ديزل</option>
                      <option value="electric">كهربائي</option>
                      <option value="hybrid">هجين</option>
                    </select>
                  </div>
                </div>

                {/* Current Mileage */}
                <div>
                  <label htmlFor="currentMileage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    المسافة المقطوعة (كم)
                  </label>
                  <input
                    type="number"
                    id="currentMileage"
                    min="0"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    required
                    value={formData.currentMileage}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Assigned Driver */}
                <div>
                  <label htmlFor="assignedDriver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    السائق المعين
                  </label>
                  <select
                    id="assignedDriver"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.assignedDriver}
                    onChange={handleInputChange}
                  >
                    <option value="">بدون سائق معين</option>
                    {mockDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    القسم
                  </label>
                  <select
                    id="departmentId"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    required
                    value={formData.departmentId}
                    onChange={handleInputChange}
                  >
                    <option value="">اختر القسم</option>
                    {mockDepartments.map(department => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Last Service Date */}
                  <div>
                    <label htmlFor="lastServiceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ آخر صيانة
                    </label>
                    <input
                      type="date"
                      id="lastServiceDate"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      value={formData.lastServiceDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Next Service Due */}
                  <div>
                    <label htmlFor="nextServiceDue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      موعد الصيانة القادمة
                    </label>
                    <input
                      type="date"
                      id="nextServiceDue"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      value={formData.nextServiceDue}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Registration Expiry */}
                  <div>
                    <label htmlFor="registrationExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ انتهاء التسجيل
                    </label>
                    <input
                      type="date"
                      id="registrationExpiry"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      required
                      value={formData.registrationExpiry}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Insurance Expiry */}
                  <div>
                    <label htmlFor="insuranceExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ انتهاء التأمين
                    </label>
                    <input
                      type="date"
                      id="insuranceExpiry"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      required
                      value={formData.insuranceExpiry}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] mr-2 dark:bg-[#101010] dark:hover:bg-[#252525]"
                    onClick={() => setShowAddVehicleForm(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#101010] dark:hover:bg-[#252525]"
                  >
                    إضافة المركبة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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