import React, { useState, useRef } from 'react';
import { Calendar, Filter, Download, Search, Car, User, Clock, TrendingUp, BarChart, PieChart, FileText, Droplets, Wrench, ChevronDown } from 'lucide-react';
import { mockVehicles, mockDrivers, mockTrips, mockFuelRecords, mockMaintenanceRecords } from '../../data/mockData';
/// <reference types="node" />
// @ts-ignore
import html2pdf from 'html2pdf.js';

const Reports: React.FC = () => {
  // State for filters
  const [selectedReport, setSelectedReport] = useState<string>('overview');

  // Calculate summary metrics
  const totalVehicles = mockVehicles.length;
  const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
  const totalDrivers = mockDrivers.length;
  const activeDrivers = mockDrivers.filter(d => d.status === 'active').length;
  
  // Calculate completed trips in the selected period (mock data - would be filtered by actual date in real app)
  const completedTrips = mockTrips.filter(t => t.status === 'completed').length;
  
  // Calculate fuel consumption & cost
  const totalFuelLiters = mockFuelRecords.reduce((sum, record) => sum + (record.fuelAmount || 0), 0);
  const totalFuelCost = mockFuelRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
  
  // Calculate maintenance stats
  const totalMaintenanceCost = mockMaintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
  const pendingMaintenance = mockMaintenanceRecords.filter(r => r.status === 'scheduled').length;

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
  };

  // Function to handle report export
  const handleExportReport = () => {
    try {
      // Use direct window.open to create a printable version that can be saved as PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("يرجى السماح بفتح النوافذ المنبثقة لتصدير التقرير");
        return;
      }
      
      // Write content directly to the window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>تقرير الأسطول</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              direction: rtl;
              background-color: white;
              color: black;
              text-align: right;
            }
            h1 {
              text-align: center;
              margin-bottom: 20px;
            }
            h2 {
              margin-top: 30px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #333;
              color: white;
              padding: 8px;
              text-align: right;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
            }
            .summary-cards {
              display: table;
              width: 100%;
              border-collapse: separate;
              border-spacing: 10px;
              margin-bottom: 20px;
            }
            .summary-card {
              display: table-cell;
              width: 25%;
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
            }
            .card-title {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .card-value {
              font-size: 18px;
              font-weight: bold;
            }
            .print-button {
              display: block;
              margin: 30px auto;
              padding: 10px 20px;
              background-color: #101010;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
            @media print {
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>تقرير نظام إدارة الأسطول</h1>
          <p style="text-align: center;">${new Date().toLocaleDateString('ar', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            calendar: 'gregory'
          })}</p>
          
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-title">المركبات النشطة</div>
              <div class="card-value">${activeVehicles} / ${totalVehicles}</div>
            </div>
            <div class="summary-card">
              <div class="card-title">السائقين النشطين</div>
              <div class="card-value">${activeDrivers} / ${totalDrivers}</div>
            </div>
            <div class="summary-card">
              <div class="card-title">استهلاك الوقود</div>
              <div class="card-value">${totalFuelLiters.toFixed(2)} لتر</div>
            </div>
            <div class="summary-card">
              <div class="card-title">تكاليف الصيانة</div>
              <div class="card-value">${formatCurrency(totalMaintenanceCost)}</div>
            </div>
          </div>
          
          <h2>تفاصيل البيانات</h2>
          <table>
            <thead>
              <tr>
                <th>البيان</th>
                <th>القيمة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>المركبات النشطة</td>
                <td>${activeVehicles} / ${totalVehicles}</td>
              </tr>
              <tr>
                <td>السائقين النشطين</td>
                <td>${activeDrivers} / ${totalDrivers}</td>
              </tr>
              <tr>
                <td>الرحلات المكتملة</td>
                <td>${completedTrips}</td>
              </tr>
              <tr>
                <td>استهلاك الوقود (لتر)</td>
                <td>${totalFuelLiters.toFixed(2)}</td>
              </tr>
              <tr>
                <td>تكلفة الوقود</td>
                <td>${formatCurrency(totalFuelCost)}</td>
              </tr>
              <tr>
                <td>تكاليف الصيانة</td>
                <td>${formatCurrency(totalMaintenanceCost)}</td>
              </tr>
              <tr>
                <td>صيانة معلقة</td>
                <td>${pendingMaintenance}</td>
              </tr>
            </tbody>
          </table>
          
          <h2>المسافة المقطوعة الشهرية (كم)</h2>
          <table>
            <thead>
              <tr>
                <th>الشهر</th>
                <th>المسافة (كم)</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyDistanceData.map(item => `
                <tr>
                  <td>${item.month}</td>
                  <td>${item.distance}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <button class="print-button" onclick="window.print(); return false;">
            طباعة / حفظ PDF
          </button>

          <script>
            // Auto trigger print dialog after a short delay to ensure content is loaded
            setTimeout(function() {
              document.title = 'تقرير_الأسطول.pdf'; // Set document title for PDF filename
            }, 500);
          </script>
        </body>
        </html>
      `);
      
      printWindow.document.close();
    } catch (error) {
      console.error("Error creating print view:", error);
      alert("حدث خطأ أثناء إنشاء التقرير، يرجى المحاولة مرة أخرى");
    }
  };

  // Monthly distance data (for chart)
  const monthlyDistanceData = [
    { month: 'يناير', distance: 4500 },
    { month: 'فبراير', distance: 3800 },
    { month: 'مارس', distance: 5200 },
    { month: 'أبريل', distance: 4900 },
    { month: 'مايو', distance: 6100 },
    { month: 'يونيو', distance: 5400 }
  ];

  // Mock fuel consumption data for chart
  const fuelConsumptionData = [
    { month: 'يناير', diesel: 800, petrol: 200 },
    { month: 'فبراير', diesel: 750, petrol: 220 },
    { month: 'مارس', diesel: 900, petrol: 250 },
    { month: 'أبريل', diesel: 850, petrol: 230 },
    { month: 'مايو', diesel: 950, petrol: 270 },
    { month: 'يونيو', diesel: 800, petrol: 240 }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">التقارير والتحليلات</h1>
        
        <div className="flex space-x-2 rtl:space-x-reverse">
          {/* Export Button */}
          <button 
            className="btn bg-[#101010] text-white hover:bg-[#252525] inline-flex items-center dark:bg-[#101010] dark:hover:bg-[#252525]"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Report Type Navigation - REMOVED */}

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-bg rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#1a1a1a] mr-3">
                  <Car className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">المركبات النشطة</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeVehicles} / {totalVehicles}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-[#252525] rounded-full h-2.5">
                  <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${(activeVehicles / totalVehicles) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="card-bg rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#1a1a1a] mr-3">
                  <User className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">السائقين النشطين</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeDrivers} / {totalDrivers}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-[#252525] rounded-full h-2.5">
                  <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${(activeDrivers / totalDrivers) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="card-bg rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#1a1a1a] mr-3">
                  <Droplets className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">استهلاك الوقود</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalFuelLiters.toFixed(2)} لتر</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">التكلفة: {formatCurrency(totalFuelCost)}</p>
              </div>
            </div>

            <div className="card-bg rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#1a1a1a] mr-3">
                  <Wrench className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">تكاليف الصيانة</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalMaintenanceCost)}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">صيانة معلقة: {pendingMaintenance}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distance Traveled Chart */}
            <div className="card-bg rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> المسافة المقطوعة
              </h2>
              <div className="h-64 flex items-end justify-between space-x-2 rtl:space-x-reverse">
                {monthlyDistanceData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-400 rounded-t" 
                      style={{ height: `${(item.distance / 6100) * 100}%` }} 
                      title={`${item.distance} كم`}
                    ></div>
                    <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fuel Consumption Chart */}
            <div className="card-bg rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Droplets className="h-5 w-5 mr-2" /> استهلاك الوقود
              </h2>
              <div className="h-64 flex items-end justify-between space-x-2 rtl:space-x-reverse">
                {fuelConsumptionData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full flex flex-col">
                      <div 
                        className="w-full bg-yellow-500 rounded-t" 
                        style={{ height: `${(item.diesel / 950) * 60}px` }} 
                        title={`ديزل: ${item.diesel} لتر`}
                      ></div>
                      <div 
                        className="w-full bg-red-400 rounded-t" 
                        style={{ height: `${(item.petrol / 270) * 40}px` }} 
                        title={`بنزين: ${item.petrol} لتر`}
                      ></div>
                    </div>
                    <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-5 rtl:space-x-reverse">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">ديزل</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">بنزين</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Vehicle Report - This would be expanded in a real implementation */}
      {selectedReport === 'vehicles' && (
        <div className="card-bg rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Car className="h-5 w-5 mr-2" /> تقرير المركبات
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 dark:bg-[#1a1a1a] dark:border-transparent"
                placeholder="بحث في المركبات..."
              />
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">يعرض إحصائيات عن حالة المركبات وأدائها</p>
          
          {/* Vehicle statistics would go here - This is just a placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-lg p-4 dark:bg-[#1a1a1a]">
              <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">توزيع المركبات حسب النوع</h3>
              <div className="h-48 flex justify-center items-center">
                <PieChart className="h-32 w-32 text-gray-400" />
              </div>
            </div>
            
            <div className="rounded-lg p-4 dark:bg-[#1a1a1a]">
              <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">حالة المركبات</h3>
              <div className="h-48 flex justify-center items-center">
                <BarChart className="h-32 w-32 text-gray-400" />
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm">* هذه البيانات تمثيلية لأغراض العرض فقط</p>
        </div>
      )}

      {/* Other report types would be implemented similarly */}
      {(selectedReport === 'drivers' || selectedReport === 'trips' || 
        selectedReport === 'fuel' || selectedReport === 'maintenance') && (
        <div className="card-bg rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedReport === 'drivers' && 'تقرير السائقين'}
            {selectedReport === 'trips' && 'تقرير الرحلات'}
            {selectedReport === 'fuel' && 'تقرير الوقود'}
            {selectedReport === 'maintenance' && 'تقرير الصيانة'}
          </h2>
          <div className="py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">تقرير قيد التطوير</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">سيتم إضافة بيانات تفصيلية هنا قريباً</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;