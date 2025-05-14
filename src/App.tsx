import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import VehicleList from './pages/Vehicles/VehicleList';
import VehicleDetails from './pages/Vehicles/VehicleDetails';
import DriverList from './pages/Drivers/DriverList';
import DriverDetails from './pages/Drivers/DriverDetails';
import TripList from './pages/Trips/TripList';
import TripDetails from './pages/Trips/TripDetails';
import MaintenanceList from './pages/Maintenance/MaintenanceList';
import FuelList from './pages/Fuel/FuelList';
import Documents from './pages/Documents/Documents';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Routes>
          <Route path="/تسجيل-الدخول" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route
            path="/"
            element={isAuthenticated ? <Layout /> : <Navigate to="/تسجيل-الدخول" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="لوحة-التحكم" element={<Dashboard />} />
            <Route path="المركبات" element={<VehicleList />} />
            <Route path="المركبات/:id" element={<VehicleDetails />} />
            <Route path="السائقين" element={<DriverList />} />
            <Route path="السائقين/:id" element={<DriverDetails />} />
            <Route path="الرحلات" element={<TripList />} />
            <Route path="الرحلات/:id" element={<TripDetails />} />
            <Route path="الصيانة" element={<MaintenanceList />} />
            <Route path="الوقود" element={<FuelList />} />
            <Route path="المستندات" element={<Documents />} />
            <Route path="التقارير" element={<Reports />} />
            <Route path="الإعدادات" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;