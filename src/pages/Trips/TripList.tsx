import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, Calendar, User, Car, MoreHorizontal, Clock, Check, X, Printer } from 'lucide-react';
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
  const [showMovementOrderForm, setShowMovementOrderForm] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [formData, setFormData] = useState({
    purpose: '',
    vehicleId: '',
    driverId: '',
    startLocation: '',
    endLocation: '',
    date: '',
    time: '',
    departmentId: '',
    passengers: 1,
    notes: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time into a single timestamp
    const startDateTime = new Date(`${formData.date}T${formData.time}`);
    
    // Create a new trip entry (in a real app, this would be sent to an API)
    const newTrip = {
      id: `trip-${Date.now()}`,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId || null,
      startTime: startDateTime.toISOString(),
      endTime: null,
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      status: 'scheduled',
      distance: 0,
      purpose: formData.purpose,
      fuelConsumed: 0,
      notes: formData.notes,
      departmentId: formData.departmentId,
      passengers: Number(formData.passengers)
    };
    
    console.log('New trip/movement order:', newTrip);
    
    // In a real application, you would add this to your trips state or send to an API
    // For now, just reset the form and close the modal
    setFormData({
      purpose: '',
      vehicleId: '',
      driverId: '',
      startLocation: '',
      endLocation: '',
      date: '',
      time: '',
      departmentId: '',
      passengers: 1,
      notes: ''
    });
    
    setShowMovementOrderForm(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('تم إنشاء أمر الحركة بنجاح');
  };

  // Print movement order function
  const printMovementOrder = () => {
    // Get vehicle and driver details
    const vehicle = mockVehicles.find(v => v.id === formData.vehicleId);
    const driver = formData.driverId ? mockDrivers.find(d => d.id === formData.driverId) : null;
    const department = mockDepartments.find(d => d.id === formData.departmentId);
    
    // Format the date in Arabic
    const formattedDate = formData.date ? 
      new Date(formData.date).toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
    
    // Create a new window
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة أمر الحركة');
      return;
    }
    
    // Set the content of the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>أمر الحركة</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              direction: rtl;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 18px;
              color: #555;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .row {
              display: flex;
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              width: 150px;
            }
            .value {
              flex: 1;
            }
            .footer {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
            }
            .signature {
              width: 30%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 50px;
              padding-top: 10px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">أمر الحركة</div>
            <div class="subtitle">وزارة الداخلية - إدارة المركبات</div>
          </div>
          
          <div class="section">
            <div class="section-title">تفاصيل الرحلة</div>
            <div class="row">
              <div class="label">الغرض من الرحلة:</div>
              <div class="value">${formData.purpose}</div>
            </div>
            <div class="row">
              <div class="label">التاريخ:</div>
              <div class="value">${formattedDate}</div>
            </div>
            <div class="row">
              <div class="label">الوقت:</div>
              <div class="value">${formData.time}</div>
            </div>
            <div class="row">
              <div class="label">نقطة الانطلاق:</div>
              <div class="value">${formData.startLocation}</div>
            </div>
            <div class="row">
              <div class="label">الوجهة:</div>
              <div class="value">${formData.endLocation}</div>
            </div>
            <div class="row">
              <div class="label">عدد الركاب:</div>
              <div class="value">${formData.passengers}</div>
            </div>
            <div class="row">
              <div class="label">القسم:</div>
              <div class="value">${department ? department.name : ''}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">تفاصيل المركبة</div>
            <div class="row">
              <div class="label">المركبة:</div>
              <div class="value">${vehicle ? `${vehicle.model}` : ''}</div>
            </div>
            <div class="row">
              <div class="label">رقم اللوحة:</div>
              <div class="value">${vehicle ? vehicle.plateNumber : ''}</div>
            </div>
            <div class="row">
              <div class="label">السائق:</div>
              <div class="value">${driver ? driver.name : 'غير معين'}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">ملاحظات إضافية</div>
            <p>${formData.notes || 'لا توجد ملاحظات'}</p>
          </div>
          
          <div class="footer">
            <div class="signature">
              <div class="signature-line">توقيع الموظف المسؤول</div>
            </div>
            <div class="signature">
              <div class="signature-line">توقيع مدير القسم</div>
            </div>
            <div class="signature">
              <div class="signature-line">توقيع مدير الإدارة</div>
            </div>
          </div>
          
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #333; color: white; border: none; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">
            طباعة
          </button>
        </body>
      </html>
    `);
    
    // Close the document
    printWindow.document.close();
  };

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <Check className="w-3 h-3 ml-1 text-white" />
            مكتملة
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <Clock className="w-3 h-3 ml-1 text-white" />
            جارية
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <Calendar className="w-3 h-3 ml-1 text-white" />
            مجدولة
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333333] text-gray-200 dark:bg-[#2a2a2a] dark:text-white">
            <X className="w-3 h-3 ml-1 text-white" />
            ملغاة
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

  // Add custom styling for date and time inputs
  useEffect(() => {
    // Add a style tag to the document head
    const style = document.createElement('style');
    style.innerHTML = `
      .date-input::-webkit-calendar-picker-indicator,
      .time-input::-webkit-calendar-picker-indicator {
        filter: invert(1) brightness(100%);
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style tag when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
          <button 
            className="btn bg-[#101010] text-white hover:bg-[#252525] inline-flex items-center mr-2 dark:bg-[#101010] dark:hover:bg-[#252525]"
            onClick={() => setShowMovementOrderForm(!showMovementOrderForm)}
          >
            <Plus className="w-4 h-4 ml-2 text-white" />
            أمر الحركة
          </button>
        </div>
      </div>

      {/* Movement Order Form Modal */}
      {showMovementOrderForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={() => setShowMovementOrderForm(false)}
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
                  onClick={() => setShowMovementOrderForm(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">أمر الحركة</h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Purpose */}
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الغرض من الرحلة
                  </label>
                  <input
                    type="text"
                    id="purpose"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    placeholder="الغرض من الرحلة"
                    required
                    value={formData.purpose}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Vehicle */}
                <div>
                  <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    المركبة
                  </label>
                  <select
                    id="vehicleId"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    required
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                  >
                    <option value="">اختر المركبة</option>
                    {mockVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver */}
                <div>
                  <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    السائق
                  </label>
                  <select
                    id="driverId"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    value={formData.driverId}
                    onChange={handleInputChange}
                  >
                    <option value="">اختر السائق</option>
                    {mockDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start and End Locations */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نقطة الانطلاق
                    </label>
                    <input
                      type="text"
                      id="startLocation"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="نقطة الانطلاق"
                      required
                      value={formData.startLocation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الوجهة
                    </label>
                    <input
                      type="text"
                      id="endLocation"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      placeholder="الوجهة"
                      required
                      value={formData.endLocation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      التاريخ
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white date-input"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الوقت
                    </label>
                    <input
                      type="time"
                      id="time"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white time-input"
                      required
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
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

                {/* Number of Passengers */}
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    عدد الركاب
                  </label>
                  <input
                    type="number"
                    id="passengers"
                    min="1"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    placeholder="عدد الركاب"
                    required
                    value={formData.passengers}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ملاحظات
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    placeholder="ملاحظات إضافية"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]"
                    onClick={() => setShowMovementOrderForm(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    className="btn ml-2 mr-2 inline-flex items-center bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]"
                    onClick={printMovementOrder}
                  >
                    <Printer className="w-4 h-4 ml-2 text-white" />
                    طباعة
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]"
                  >
                    إصدار أمر الحركة
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
                <Filter className="h-5 w-5 text-gray-400 dark:text-white ml-2" />
                <span>{filterStatus ? `الحالة: ${filterStatus === 'completed' ? 'مكتملة' : filterStatus === 'in-progress' ? 'جارية' : filterStatus === 'scheduled' ? 'مجدولة' : 'ملغاة'}` : 'تصفية حسب الحالة'}</span>
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
                <Filter className="h-5 w-5 text-gray-400 dark:text-white ml-2" />
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
                            <Car className="h-7 w-7 text-gray-500 dark:text-white" />
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
              <Calendar className="h-12 w-12 text-gray-400 dark:text-white mx-auto mb-4" />
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
                          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-white">
                            <MoreHorizontal className="h-5 w-5 dark:text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 dark:text-white mx-auto mb-4" />
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