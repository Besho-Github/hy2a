import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, Car, MoreHorizontal, Check, Calendar, Clock, Droplet } from 'lucide-react';
import { mockFuelRecords, mockVehicles, mockDrivers } from '../../data/mockData';

const FuelList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVehicle, setFilterVehicle] = useState<string | null>(null);
  const [filterFuelType, setFilterFuelType] = useState<string | null>(null);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showFuelTypeDropdown, setShowFuelTypeDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    date: new Date().toISOString().split('T')[0],
    fuelAmount: '',
    fuelType: 'gasoline',
    cost: '',
    odometer: '',
    stationName: '',
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
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new fuel record entry (in a real app, this would be sent to an API)
    const newFuelRecord = {
      id: `fuel-${Date.now()}`,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      date: formData.date,
      fuelAmount: parseFloat(formData.fuelAmount),
      fuelType: formData.fuelType,
      cost: parseFloat(formData.cost),
      odometer: parseInt(formData.odometer),
      stationName: formData.stationName,
      notes: formData.notes
    };
    
    console.log('New fuel record:', newFuelRecord);
    
    // In a real application, you would add this to your state or send to an API
    // For now, just reset the form and close the modal
    setFormData({
      vehicleId: '',
      driverId: '',
      date: new Date().toISOString().split('T')[0],
      fuelAmount: '',
      fuelType: 'gasoline',
      cost: '',
      odometer: '',
      stationName: '',
      notes: ''
    });
    
    setShowAddModal(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('تم إضافة سجل الوقود بنجاح');
  };

  // Filter the fuel records based on search term and filters
  const filteredRecords = mockFuelRecords.filter(record => {
    const vehicle = mockVehicles.find(v => v.id === record.vehicleId);
    const driver = mockDrivers.find(d => d.id === record.driverId);
    
    const matchesSearch = 
      (vehicle ? vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (driver ? driver.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      record.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesVehicle = filterVehicle ? record.vehicleId === filterVehicle : true;
    const matchesFuelType = filterFuelType ? record.fuelType === filterFuelType : true;
    
    return matchesSearch && matchesVehicle && matchesFuelType;
  });

  // Get vehicle plate number and model
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = mockVehicles.find(vehicle => vehicle.id === vehicleId);
    return vehicle 
      ? `${vehicle.plateNumber} - ${vehicle.model} (${vehicle.year})`
      : 'غير معروف';
  };

  // Get driver name
  const getDriverName = (driverId: string) => {
    const driver = mockDrivers.find(driver => driver.id === driverId);
    return driver ? driver.name : 'غير معروف';
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} درهم`;
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">سجلات الوقود</h1>
        <button 
          className="btn bg-[#101010] text-white hover:bg-[#252525] inline-flex items-center dark:bg-[#101010] dark:hover:bg-[#252525]"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 ml-2 text-white" />
          إضافة سجل وقود
        </button>
      </div>

      {/* Add Fuel Record Modal */}
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
                  إضافة سجل وقود جديد
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Selection */}
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

                {/* Driver Selection */}
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

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    التاريخ *
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent dark:text-white"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Fuel Amount */}
                  <div>
                    <label htmlFor="fuelAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      كمية الوقود (لتر) *
                    </label>
                    <input
                      type="number"
                      id="fuelAmount"
                      step="0.1"
                      min="0"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.fuelAmount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نوع الوقود *
                    </label>
                    <select
                      id="fuelType"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="gasoline">بنزين</option>
                      <option value="diesel">ديزل</option>
                      <option value="electric">كهربائي</option>
                      <option value="hybrid">هجين</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cost */}
                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      التكلفة (درهم) *
                    </label>
                    <input
                      type="number"
                      id="cost"
                      step="0.1"
                      min="0"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.cost}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Odometer */}
                  <div>
                    <label htmlFor="odometer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      قراءة العداد (كم) *
                    </label>
                    <input
                      type="number"
                      id="odometer"
                      min="0"
                      className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                      value={formData.odometer}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Station Name */}
                <div>
                  <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    اسم محطة الوقود *
                  </label>
                  <input
                    type="text"
                    id="stationName"
                    className="input mt-1 dark:bg-[#1a1a1a] dark:border-transparent"
                    placeholder="مثال: محطة أدنوك"
                    value={formData.stationName}
                    onChange={handleInputChange}
                    required
                  />
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
                    placeholder="أي ملاحظات إضافية حول عملية التزود بالوقود"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
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
                    حفظ سجل الوقود
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
              placeholder="البحث في سجلات الوقود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Vehicle Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowVehicleDropdown(!showVehicleDropdown);
                setShowFuelTypeDropdown(false);
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

          {/* Fuel Type Filter */}
          <div className="relative">
            <button
              type="button"
              className="input flex items-center justify-between w-full dark:bg-[#1a1a1a] dark:border-transparent"
              onClick={() => {
                setShowFuelTypeDropdown(!showFuelTypeDropdown);
                setShowVehicleDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Droplet className="h-5 w-5 text-gray-400 ml-2" />
                <span>{filterFuelType ? `نوع الوقود: ${getFuelTypeArabic(filterFuelType)}` : 'تصفية حسب نوع الوقود'}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showFuelTypeDropdown && (
              <div className="absolute z-10 mt-1 w-full card-bg shadow-lg rounded-md py-1">
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterFuelType(null);
                    setShowFuelTypeDropdown(false);
                  }}
                >
                  جميع الأنواع
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterFuelType('gasoline');
                    setShowFuelTypeDropdown(false);
                  }}
                >
                  بنزين
                </button>
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  onClick={() => {
                    setFilterFuelType('diesel');
                    setShowFuelTypeDropdown(false);
                  }}
                >
                  ديزل
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fuel Records Table */}
      <div className="card-bg rounded-lg shadow border-0 dark:border-0">
        <div className="table-container">
          <table className="table dark:border-0">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-0 dark:border-0">
              <tr className="border-0 dark:border-0">
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  المركبة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  السائق
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  التاريخ
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  الكمية / النوع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  التكلفة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  العداد
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  المحطة
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
                        {mockVehicles.find(v => v.id === record.vehicleId)?.plateNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {mockVehicles.find(v => v.id === record.vehicleId)?.model}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getDriverName(record.driverId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.fuelAmount.toFixed(1)} لتر
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getFuelTypeArabic(record.fuelType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(record.cost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.odometer.toLocaleString()} كم
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.stationName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <Link
                          to={`/الوقود/${record.id}`}
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
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">لم يتم العثور على سجلات وقود</h3>
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
    </div>
  );
};

export default FuelList;