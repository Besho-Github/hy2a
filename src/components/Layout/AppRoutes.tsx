import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from '../../pages/Dashboard/Dashboard';
import VehicleList from '../../pages/Vehicles/VehicleList';
import VehicleDetails from '../../pages/Vehicles/VehicleDetails';
import DriverList from '../../pages/Drivers/DriverList';
import DriverDetails from '../../pages/Drivers/DriverDetails';
import TripList from '../../pages/Trips/TripList';
import TripDetails from '../../pages/Trips/TripDetails';
import MaintenanceList from '../../pages/Maintenance/MaintenanceList';
import MaintenanceDetails from '../../pages/Maintenance/MaintenanceDetails';
import NotFound from '../../pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="لوحة-التحكم" element={<Dashboard />} />
        <Route path="المركبات" element={<VehicleList />} />
        <Route path="المركبات/:id" element={<VehicleDetails />} />
        <Route path="السائقين" element={<DriverList />} />
        <Route path="السائقين/:id" element={<DriverDetails />} />
        <Route path="الرحلات" element={<TripList />} />
        <Route path="الرحلات/:id" element={<TripDetails />} />
        <Route path="الصيانة" element={<MaintenanceList />} />
        <Route path="الصيانة/:id" element={<MaintenanceDetails />} />
        <Route path="الوقود" element={<NotFound />} />
        <Route path="المستندات" element={<NotFound />} />
        <Route path="التقارير" element={<NotFound />} />
        <Route path="الإعدادات" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 