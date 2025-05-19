import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Clock, Car, User, FileCheck, Building } from 'lucide-react';
import { mockDocuments, mockVehicles, mockDrivers } from '../../data/mockData';

const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const document = mockDocuments.find(doc => doc.id === id);

  // If document not found
  if (!document) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/المستندات" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
            <ArrowRight className="h-5 w-5 ml-2" />
            <span>العودة إلى المستندات</span>
          </Link>
        </div>
        <div className="card-bg rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">مستند غير موجود</h2>
          <p className="text-gray-600 dark:text-gray-400">المستند المطلوب غير موجود أو تم حذفه.</p>
        </div>
      </div>
    );
  }

  // Get related vehicle or driver
  const relatedVehicle = document.vehicleId 
    ? mockVehicles.find(v => v.id === document.vehicleId) 
    : null;
    
  const relatedDriver = document.driverId
    ? mockDrivers.find(d => d.id === document.driverId)
    : null;

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate: string) => {
    const diffDays = getDaysUntilExpiry(expiryDate);
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

  // Get status text and color
  const getStatusInfo = () => {
    if (isExpired(document.expiryDate)) {
      return {
        text: 'منتهية الصلاحية',
        icon: <Clock className="h-5 w-5 ml-2 text-red-400" />,
        textColor: 'text-red-500 dark:text-red-400'
      };
    } else if (isExpiringSoon(document.expiryDate)) {
      const daysLeft = getDaysUntilExpiry(document.expiryDate);
      return {
        text: `تنتهي خلال ${daysLeft} يوم`,
        icon: <Clock className="h-5 w-5 ml-2 text-yellow-400" />,
        textColor: 'text-yellow-500 dark:text-yellow-400'
      };
    } else {
      return {
        text: 'سارية المفعول',
        icon: <FileCheck className="h-5 w-5 ml-2 text-white" />,
        textColor: 'text-gray-900 dark:text-white'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/المستندات" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
          <ArrowRight className="h-5 w-5 ml-2" />
          <span>العودة إلى المستندات</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getDocumentTypeArabic(document.type)}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Document Information */}
        <div className="card-bg rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
            <FileText className="h-6 w-6 ml-2" />
            معلومات المستند
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">نوع المستند</p>
              <p className="text-gray-900 dark:text-white">{getDocumentTypeArabic(document.type)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم المستند</p>
              <p className="text-gray-900 dark:text-white">{document.documentNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">تاريخ الإصدار</p>
              <p className="text-gray-900 dark:text-white">{formatDate(document.issueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">تاريخ الانتهاء</p>
              <p className={statusInfo.textColor}>{formatDate(document.expiryDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الحالة</p>
              <div className="flex items-center">
                {statusInfo.icon}
                <p className={statusInfo.textColor}>{statusInfo.text}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الجهة المصدرة</p>
              <div className="flex items-center">
                <Building className="h-4 w-4 ml-1 text-gray-400" />
                <p className="text-gray-900 dark:text-white">{document.issuingAuthority}</p>
              </div>
            </div>
          </div>

          {document.notes && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ملاحظات</p>
              <p className="text-gray-900 dark:text-white">{document.notes}</p>
            </div>
          )}

          {/* Document Preview Placeholder */}
          <div className="mt-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">معاينة المستند غير متاحة</p>
            <button className="mt-3 px-4 py-2 bg-[#101010] text-white rounded hover:bg-[#252525] focus:outline-none dark:bg-[#1a1a1a] dark:hover:bg-[#252525]">
              تحميل المستند
            </button>
          </div>
        </div>

        {/* Related Information */}
        <div className="space-y-6">
          {/* Related Vehicle */}
          {relatedVehicle && (
            <div className="card-bg rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                <Car className="h-6 w-6 ml-2" />
                المركبة المتعلقة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم اللوحة</p>
                  <Link 
                    to={`/المركبات/${relatedVehicle.id}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {relatedVehicle.plateNumber}
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الطراز</p>
                  <p className="text-gray-900 dark:text-white">{relatedVehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">السنة</p>
                  <p className="text-gray-900 dark:text-white">{relatedVehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الحالة</p>
                  <p className="text-gray-900 dark:text-white">
                    {relatedVehicle.status === 'active' ? 'نشط' : 
                     relatedVehicle.status === 'maintenance' ? 'في الصيانة' : 
                     relatedVehicle.status === 'inactive' ? 'غير نشط' : relatedVehicle.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Related Driver */}
          {relatedDriver && (
            <div className="card-bg rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                <User className="h-6 w-6 ml-2" />
                السائق المتعلق
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الاسم</p>
                  <Link 
                    to={`/السائقين/${relatedDriver.id}`}
                    className="text-gray-900 dark:text-white hover:underline"
                  >
                    {relatedDriver.name}
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم الرخصة</p>
                  <p className="text-gray-900 dark:text-white">{relatedDriver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">تاريخ انتهاء الرخصة</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(relatedDriver.licenseExpiry)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم الهاتف</p>
                  <p className="text-gray-900 dark:text-white">{relatedDriver.contactNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Renewal Information - For expired or soon to expire documents */}
          {(isExpired(document.expiryDate) || isExpiringSoon(document.expiryDate)) && (
            <div className="card-bg rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                <Calendar className="h-6 w-6 ml-2" />
                معلومات التجديد
              </h2>
              <div className="rounded-lg bg-[#151515] p-4">
                <p className="text-gray-300 mb-4">
                  {isExpired(document.expiryDate) 
                    ? 'هذا المستند منتهي الصلاحية ويحتاج إلى تجديد فوراً.' 
                    : `هذا المستند سينتهي قريباً (خلال ${getDaysUntilExpiry(document.expiryDate)} يوم) ويحتاج إلى تجديد.`}
                </p>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-[#101010] text-white rounded hover:bg-[#252525] focus:outline-none dark:bg-[#1a1a1a] dark:hover:bg-[#252525]">
                    بدء عملية التجديد
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 rtl:space-x-reverse">
        <button className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]">
          تعديل المستند
        </button>
        <button className="btn bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525]">
          طباعة المستند
        </button>
      </div>
    </div>
  );
};

export default DocumentDetails; 