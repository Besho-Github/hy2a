import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, User, MoreHorizontal, Check, X, Clock } from 'lucide-react';
import { mockDrivers, mockDepartments, mockVehicles } from '../../data/mockData';

const DriverList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    contactNumber: '',
    email: '',
    status: 'active',
    assignedVehicleId: '',
    departmentId: '',
    hireDate: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    }
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
    
    if (id.startsWith('emergencyContact.')) {
      // Handle emergencyContact nested object
      const field = id.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value
        }
      });
    } else {
      // Handle top level fields
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new driver entry (in a real app, this would be sent to an API)
    const newDriver = {
      id: `driver-${Date.now()}`,
      ...formData,
      profileImage: null,
      rating: 5.0,
      violations: 0,
      trips: []
    };
    
    console.log('New driver:', newDriver);
    
    // In a real application, you would add this to your drivers state or send to an API
    // For now, just reset the form and close the modal
    setFormData({
      name: '',
      licenseNumber: '',
      licenseExpiry: '',
      contactNumber: '',
      email: '',
      status: 'active',
      assignedVehicleId: '',
      departmentId: '',
      hireDate: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    });
    
    setShowAddDriverForm(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('تم إضافة السائق بنجاح');
  };

  // Filter the drivers based on search term and filters
  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus ? driver.status === filterStatus : true;
    const matchesDepartment = filterDepartment ? driver.departmentId === filterDepartment : true;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get department name from ID
  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(dept => dept.id === departmentId);
    return department ? department.name : 'غير معروف';
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  // Check if license is expiring soon (within 30 days)
  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <Check className="w-3 h-3 mr-1 text-white" />
            نشط
          </span>
        );
      case 'on-leave':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <Clock className="w-3 h-3 mr-1 text-white" />
            في إجازة
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <X className="w-3 h-3 mr-1 text-white" />
            غير نشط
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">السائقين</h1>
        <button 
          className="btn bg-[#101010] text-white hover:bg-[#252525] inline-flex items-center dark:bg-[#101010] dark:hover:bg-[#252525]"
          onClick={() => setShowAddDriverForm(true)}
        >
          <Plus className="w-4 h-4 ml-2 text-white" />
          إضافة سائق
        </button>
      </div>

      {/* Add Driver Form Modal */}
      {showAddDriverForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={() => setShowAddDriverForm(false)}
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
                  onClick={() => setShowAddDriverForm(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">إضافة سائق جديد</h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    placeholder="الاسم الكامل"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="example@domain.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="+9715xxxxxxxx"
                      required
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* License Number */}
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      رقم الرخصة
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="مثال: DL123456"
                      required
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* License Expiry */}
                  <div>
                    <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ انتهاء الرخصة
                    </label>
                    <input
                      type="date"
                      id="licenseExpiry"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      required
                      value={formData.licenseExpiry}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Hire Date */}
                  <div>
                    <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ التعيين
                    </label>
                    <input
                      type="date"
                      id="hireDate"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      required
                      value={formData.hireDate}
                      onChange={handleInputChange}
                    />
                  </div>

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
                      <option value="on-leave">في إجازة</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  {/* Assigned Vehicle */}
                  <div>
                    <label htmlFor="assignedVehicleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      المركبة المعينة
                    </label>
                    <select
                      id="assignedVehicleId"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.assignedVehicleId}
                      onChange={handleInputChange}
                    >
                      <option value="">بدون مركبة معينة</option>
                      {mockVehicles.filter(v => !v.assignedDriver || v.assignedDriver === '').map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.plateNumber} - {vehicle.model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">معلومات الاتصال في حالات الطوارئ</h4>
                  
                  <div>
                    <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الاسم
                    </label>
                    <input
                      type="text"
                      id="emergencyContact.name"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="اسم جهة الاتصال في الطوارئ"
                      required
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        صلة القرابة
                      </label>
                      <input
                        type="text"
                        id="emergencyContact.relationship"
                        className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                        placeholder="مثال: أخ، أخت، زوجة"
                        required
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        id="emergencyContact.phone"
                        className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                        placeholder="+9715xxxxxxxx"
                        required
                        value={formData.emergencyContact.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] mr-2 dark:bg-[#101010] dark:hover:bg-[#252525]"
                    onClick={() => setShowAddDriverForm(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#101010] dark:hover:bg-[#252525]"
                  >
                    إضافة السائق
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card-bg rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-white" />
            </div>
            <input
              type="text"
              className="input pl-10 dark:bg-[#1a1a1a] dark:border-transparent"
              placeholder="البحث عن سائقين..."
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
                <Filter className="h-5 w-5 text-gray-400 dark:text-white mr-2" />
                <span>{filterStatus ? `الحالة: ${filterStatus === 'active' ? 'نشط' : filterStatus === 'on-leave' ? 'في إجازة' : 'غير نشط'}` : 'تصفية حسب الحالة'}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-white" />
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
                    setFilterStatus('on-leave');
                    setShowStatusDropdown(false);
                  }}
                >
                  في إجازة
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
                <Filter className="h-5 w-5 text-gray-400 dark:text-white mr-2" />
                <span>
                  {filterDepartment 
                    ? `القسم: ${getDepartmentName(filterDepartment)}` 
                    : 'تصفية حسب القسم'}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-white" />
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

      {/* Driver List */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0">
        <div className="table-container">
          <table className="table dark:border-0">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-0 dark:border-0">
              <tr className="border-0 dark:border-0">
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  السائق
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  رقم الرخصة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  تاريخ الانتهاء
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  القسم
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  التقييم
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">إجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-0 divide-transparent dark:divide-transparent">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border-0 dark:border-0">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-[#1a1a1a] rounded-md flex items-center justify-center">
                        <User className="h-7 w-7 text-gray-500 dark:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {driver.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {driver.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.licenseNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className={isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-amber-600 dark:text-amber-400' : ''}>
                      {formatDate(driver.licenseExpiry)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(driver.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getDepartmentName(driver.departmentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.rating} / 5.0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/السائقين/${driver.id}`}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 ml-3"
                      >
                        عرض
                      </Link>
                      <button className="text-gray-400 hover:text-gray-500 dark:hover:text-white">
                        <MoreHorizontal className="h-5 w-5 dark:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredDrivers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على سائقين</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              حاول تعديل معايير البحث أو التصفية.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverList;