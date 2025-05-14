import React from 'react';
import { Link } from 'react-router-dom';
import { Car, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-center mb-8">
        <AlertTriangle className="h-12 w-12 text-warning-600 dark:text-warning-400 mr-3" />
        <Car className="h-12 w-12 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center">
        404 - Page Not Found
      </h2>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="btn btn-primary inline-flex items-center px-6"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;