import React from 'react';
import { 
  Car, 
  Users, 
  CalendarClock, 
  Wrench, 
  Fuel, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { mockDashboardStats, mockMonthlyStats, mockVehicles } from '../../data/mockData';
import StatCard from './components/StatCard';
import DataCard from './components/DataCard';

const Dashboard: React.FC = () => {
  // Vehicle status data for pie chart
  const vehicleStatusData = [
    { name: 'نشط', value: mockDashboardStats.activeVehicles, color: '#333333' },
    { name: 'صيانة', value: mockDashboardStats.inMaintenanceVehicles, color: '#777777' },
    { name: 'غير نشط', value: mockDashboardStats.inactiveVehicles, color: '#AAAAAA' }
  ];
  
  // Get vehicles with upcoming expirations
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
  
  const vehiclesWithExpiringDocs = mockVehicles.filter(vehicle => {
    const registrationExpiry = new Date(vehicle.registrationExpiry);
    const insuranceExpiry = new Date(vehicle.insuranceExpiry);
    return (
      (registrationExpiry > currentDate && registrationExpiry < thirtyDaysFromNow) ||
      (insuranceExpiry > currentDate && insuranceExpiry < thirtyDaysFromNow)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">آخر تحديث:</span>
          <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي المركبات" 
          value={mockDashboardStats.totalVehicles.toString()} 
          icon={<Car />} 
          trend="neutral"
          color="primary"
        />
        <StatCard 
          title="إجمالي السائقين" 
          value={mockDashboardStats.totalDrivers.toString()} 
          icon={<Users />} 
          trend="neutral" 
          color="secondary"
        />
        <StatCard 
          title="الرحلات هذا الشهر" 
          value={mockDashboardStats.totalTripsThisMonth.toString()} 
          icon={<CalendarClock />} 
          trend="up" 
          trendValue="+12%" 
          color="primary"
        />
        <StatCard 
          title="نسبة استخدام الأسطول" 
          value={`${mockDashboardStats.fleetUtilization}%`} 
          icon={<Car />} 
          trend="up" 
          trendValue="+5%" 
          color="secondary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataCard title="التكاليف الشهرية">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockMonthlyStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} AED`, '']} />
                <Legend />
                <Bar dataKey="fuelCost" name="تكلفة الوقود" fill="#555555" />
                <Bar dataKey="maintenanceCost" name="تكلفة الصيانة" fill="#333333" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DataCard>

        <DataCard title="المسافة الشهرية وعدد الرحلات">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockMonthlyStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="distance" 
                  name="المسافة (كم)" 
                  stroke="#333333" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="tripCount" 
                  name="عدد الرحلات" 
                  stroke="#777777" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DataCard>
      </div>

      {/* More Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DataCard title="حالة الأسطول">
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'المركبات']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DataCard>

        <DataCard title="المؤشرات الرئيسية">
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">كفاءة الوقود</span>
              <span className="text-sm font-bold">{mockDashboardStats.averageFuelEfficiency} كم/لتر</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#101010] rounded-full">
              <div 
                className="h-2 bg-gray-600 dark:bg-[#2a2a2a] rounded-full" 
                style={{ width: `${(mockDashboardStats.averageFuelEfficiency / 15) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">التكلفة لكل كيلومتر</span>
              <span className="text-sm font-bold">{mockDashboardStats.costPerKilometer} درهم/كم</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#101010] rounded-full">
              <div 
                className="h-2 bg-gray-800 dark:bg-[#1a1a1a] rounded-full" 
                style={{ width: `${(3 / mockDashboardStats.costPerKilometer) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">تكلفة الصيانة</span>
              <span className="text-sm font-bold">{mockDashboardStats.maintenanceCostThisMonth} درهم</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#101010] rounded-full">
              <div 
                className="h-2 bg-gray-500 dark:bg-[#333333] rounded-full" 
                style={{ width: `${(mockDashboardStats.maintenanceCostThisMonth / 5000) * 100}%` }}
              ></div>
            </div>
          </div>
        </DataCard>

        <DataCard title="التنبيهات والإشعارات">
          <div className="space-y-4 pt-2">
            {mockDashboardStats.upcomingMaintenance > 0 && (
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md dark:bg-[#1a1a1a] dark:border-[#333333]">
                  <Wrench className="h-5 w-5 text-gray-500 dark:text-gray-100" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    صيانة قادمة
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {mockDashboardStats.upcomingMaintenance} مركبة تحتاج للصيانة
                  </p>
                </div>
              </div>
            )}
            
            {vehiclesWithExpiringDocs.length > 0 && (
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md dark:bg-[#1a1a1a] dark:border-[#333333]">
                  <FileText className="h-5 w-5 text-gray-500 dark:text-gray-100" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    مستندات منتهية الصلاحية
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {vehiclesWithExpiringDocs.length} مركبة بمستندات تنتهي قريبًا
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md dark:bg-[#1a1a1a] dark:border-[#333333]">
                <Fuel className="h-5 w-5 text-gray-500 dark:text-gray-100" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  استهلاك الوقود
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {mockDashboardStats.fuelConsumedThisMonth} لتر تم استهلاكه هذا الشهر ({mockDashboardStats.fuelCostThisMonth} درهم)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md dark:bg-[#1a1a1a] dark:border-[#333333]">
                <CalendarClock className="h-5 w-5 text-gray-500 dark:text-gray-100" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  الرحلات القادمة
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  2 رحلات مجدولة غدًا
                </p>
              </div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
};

export default Dashboard;