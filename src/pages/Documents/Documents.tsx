import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, FileText, MoreHorizontal, Check, AlertTriangle, Clock, Calendar, Car, User } from 'lucide-react';
import { mockDocuments, mockVehicles, mockDrivers } from '../../data/mockData';

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'registration',
    vehicleId: '',
    driverId: '',
    documentNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    issuingAuthority: '',
    status: 'active',
    notes: ''
  });

  // Add custom styling for date inputs
  useEffect(() => {
    // Add a style tag to the document head
    const style = document.createElement('style');
    style.innerHTML = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1) brightness(100%);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style tag when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    // If document type changes, reset the related fields
    if (id === 'type') {
      setFormData(prev => ({
        ...prev,
        vehicleId: value === 'license' ? '' : prev.vehicleId,
        driverId: value !== 'license' ? '' : prev.driverId
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new document entry (in a real app, this would be sent to an API)
    const newDocument = {
      id: `doc-${Date.now()}`,
      ...formData,
      documentUrl: null
    };
    
    console.log('New document:', newDocument);
    
    // In a real application, you would add this to your state or send to an API
    // For now, just reset the form and close the modal
    setFormData({
      type: 'registration',
      vehicleId: '',
      driverId: '',
      documentNumber: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      issuingAuthority: '',
      status: 'active',
      notes: ''
    });
    
    setShowAddModal(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('تم إضافة المستند بنجاح');
  };

  // Filter the documents based on search term and filters
  const filteredDocuments = mockDocuments.filter(document => {
    let relatedInfo = '';
    
    // Get related vehicle or driver info for search
    if (document.vehicleId) {
      const vehicle = mockVehicles.find(v => v.id === document.vehicleId);
      if (vehicle) {
        relatedInfo = `${vehicle.plateNumber} ${vehicle.model}`;
      }
    } else if (document.driverId) {
      const driver = mockDrivers.find(d => d.id === document.driverId);
      if (driver) {
        relatedInfo = driver.name;
      }
    }
    
    const matchesSearch = 
      document.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relatedInfo.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType ? document.type === filterType : true;
    const matchesStatus = filterStatus ? document.status === filterStatus : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get related info (vehicle or driver)
  const getRelatedInfo = (document: typeof mockDocuments[0]) => {
    if (document.vehicleId) {
      const vehicle = mockVehicles.find(v => v.id === document.vehicleId);
      return vehicle 
        ? { type: 'vehicle', name: `${vehicle.plateNumber} - ${vehicle.model}`, id: vehicle.id }
        : { type: 'vehicle', name: 'غير معروف', id: '' };
    } else if (document.driverId) {
      const driver = mockDrivers.find(d => d.id === document.driverId);
      return driver 
        ? { type: 'driver', name: driver.name, id: driver.id }
        : { type: 'driver', name: 'غير معروف', id: '' };
    }
    return null;
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // Check if document is expired
  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  // Get document type in Arabic
  const getDocumentTypeArabic = (type: string) => {
    switch (type) {
      case 'registration':
        return 'تسجيل مركبة';
      case 'insurance':
        return 'تأمين مركبة';
      case 'license':
        return 'رخصة قيادة';
      case 'permit':
        return 'تصريح';
      case 'other':
        return 'أخرى';
      default:
        return type;
    }
  };

  // Render document status badge
  const renderStatusBadge = (document: typeof mockDocuments[0]) => {
    if (isExpired(document.expiryDate)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-red-300 dark:bg-[#2a2a2a]">
          <AlertTriangle className="w-3 h-3 mr-1 text-red-300" />
          منتهية الصلاحية
        </span>
      );
    } else if (isExpiringSoon(document.expiryDate)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-yellow-300 dark:bg-[#2a2a2a]">
          <Clock className="w-3 h-3 mr-1 text-yellow-300" />
          تنتهي قريباً
        </span>
      );
    } else {
      switch (document.status) {
        case 'active':
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
              <Check className="w-3 h-3 mr-1" />
              سارية
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
              {document.status}
            </span>
          );
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">المستندات</h1>
        <button 
          className="btn bg-[#101010] text-white hover:bg-[#252525] inline-flex items-center dark:bg-[#101010] dark:hover:bg-[#252525]"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 ml-2 text-white" />
          إضافة مستند
        </button>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={() => setShowAddModal(false)}
          >
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-[#040404] opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom card-bg rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6 dark:bg-[#101010]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  إضافة مستند جديد
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Document Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    نوع المستند *
                  </label>
                  <select
                    id="type"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="registration">تسجيل مركبة</option>
                    <option value="insurance">تأمين مركبة</option>
                    <option value="license">رخصة قيادة</option>
                    <option value="permit">تصريح</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                {/* Vehicle or Driver Selection based on document type */}
                {(formData.type === 'registration' || formData.type === 'insurance') && (
                  <div>
                    <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      المركبة *
                    </label>
                    <select
                      id="vehicleId"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.vehicleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>اختر المركبة</option>
                      {mockVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.plateNumber} - {vehicle.model} ({vehicle.year})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.type === 'license' && (
                  <div>
                    <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      السائق *
                    </label>
                    <select
                      id="driverId"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.driverId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>اختر السائق</option>
                      {mockDrivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Document Number */}
                <div>
                  <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    رقم المستند *
                  </label>
                  <input
                    type="text"
                    id="documentNumber"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    placeholder="مثال: REG-12345"
                    required
                  />
                </div>

                {/* Issue and Expiry Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ الإصدار *
                    </label>
                    <input
                      type="date"
                      id="issueDate"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تاريخ الانتهاء *
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Issuing Authority */}
                <div>
                  <label htmlFor="issuingAuthority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الجهة المصدرة *
                  </label>
                  <input
                    type="text"
                    id="issuingAuthority"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.issuingAuthority}
                    onChange={handleInputChange}
                    placeholder="مثال: دائرة النقل بأبوظبي"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    حالة المستند
                  </label>
                  <select
                    id="status"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">ساري المفعول</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="أي ملاحظات إضافية حول المستند"
                  ></textarea>
                </div>

                {/* File Upload (Not functional in this demo) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    تحميل المستند
                  </label>
                  <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-[#333]">
                    <div className="space-y-1 text-center">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white focus-within:outline-none"
                        >
                          <span>رفع ملف</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pr-1">أو السحب والإفلات</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, PNG, JPG (حتى 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]"
                    onClick={() => setShowAddModal(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn ml-2 mr-2 inline-flex items-center bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]"
                  >
                    حفظ المستند
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
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 dark:bg-[#1a1a1a] dark:border-transparent"
              placeholder="البحث في المستندات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Document Type Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
              }}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 ml-2" />
                <span>
                  {filterType 
                    ? `نوع المستند: ${getDocumentTypeArabic(filterType)}`
                    : 'تصفية حسب نوع المستند'}
                </span>
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
                    setFilterType('registration');
                    setShowTypeDropdown(false);
                  }}
                >
                  تسجيل مركبة
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterType('insurance');
                    setShowTypeDropdown(false);
                  }}
                >
                  تأمين مركبة
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterType('license');
                    setShowTypeDropdown(false);
                  }}
                >
                  رخصة قيادة
                </button>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTypeDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Check className="h-5 w-5 text-gray-400 ml-2" />
                <span>
                  {filterStatus === 'active'
                    ? 'الحالة: سارية المفعول'
                    : filterStatus === 'expired'
                    ? 'الحالة: منتهية الصلاحية'
                    : filterStatus === 'expiring-soon'
                    ? 'الحالة: تنتهي قريباً'
                    : 'تصفية حسب الحالة'}
                </span>
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
                  سارية المفعول
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('expiring-soon');
                    setShowStatusDropdown(false);
                  }}
                >
                  تنتهي قريباً
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterStatus('expired');
                    setShowStatusDropdown(false);
                  }}
                >
                  منتهية الصلاحية
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0">
        <div className="table-container">
          <table className="table dark:border-0">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-0 dark:border-0">
              <tr className="border-0 dark:border-0">
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  نوع المستند
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  رقم المستند
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  المركبة / السائق
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  تاريخ الإصدار
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  تاريخ الانتهاء
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  الجهة المصدرة
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
              {filteredDocuments.length > 0 ? (
                filteredDocuments
                  .filter(doc => {
                    // Apply status filter
                    if (!filterStatus) return true;
                    if (filterStatus === 'expired') return isExpired(doc.expiryDate);
                    if (filterStatus === 'expiring-soon') return !isExpired(doc.expiryDate) && isExpiringSoon(doc.expiryDate);
                    if (filterStatus === 'active') return !isExpired(doc.expiryDate) && !isExpiringSoon(doc.expiryDate);
                    return true;
                  })
                  .map(document => {
                    const relatedInfo = getRelatedInfo(document);
                    const isDocumentExpired = isExpired(document.expiryDate);
                    const isDocumentExpiringSoon = isExpiringSoon(document.expiryDate);
                    
                    return (
                      <tr 
                        key={document.id} 
                        className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border-0 dark:border-0 cursor-pointer"
                        onClick={() => window.location.href = `/المستندات/${document.id}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {getDocumentTypeArabic(document.type)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {document.documentNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {relatedInfo && (
                            <div className="flex items-center">
                              {relatedInfo.type === 'vehicle' ? (
                                <Car className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                              )}
                              <div className="text-sm text-gray-900 dark:text-white">
                                {relatedInfo.name}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(document.issueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDocumentExpired ? 'text-red-500 dark:text-red-400' : isDocumentExpiringSoon ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                            {formatDate(document.expiryDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {document.issuingAuthority}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(document)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <Link 
                              to={`/المستندات/${document.id}`} 
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
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على مستندات</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      حاول تعديل معايير البحث أو التصفية، أو قم بإضافة مستند جديد.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;