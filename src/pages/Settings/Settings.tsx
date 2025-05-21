import React, { useState } from 'react';
import { User, UserPlus, UserCog, Key, Edit, Trash2, UserX, Eye, EyeOff, Shield, Settings as SettingsIcon, ChevronDown, Search, X, Save, Check, AlertTriangle } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status?: 'active' | 'inactive';
}

const Settings: React.FC = () => {
  // State for users management
  const [users, setUsers] = useState<UserType[]>([...mockUsers.map(user => ({...user, status: 'active' as const}))]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Form states
  const [formData, setFormData] = useState<UserType>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const [formError, setFormError] = useState<string>('');

  // Filtered users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle input change for form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle adding a new user
  const handleAddUser = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('جميع الحقول مطلوبة');
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // Check if email exists
    if (users.some(user => user.email === formData.email && user.id !== formData.id)) {
      setFormError('البريد الإلكتروني مستخدم بالفعل');
      return;
    }

    // Add new user or update existing one
    if (editingUserId) {
      setUsers(users.map(user => 
        user.id === editingUserId 
          ? { ...formData, id: editingUserId }
          : user
      ));
    } else {
      // Generate a new ID 
      const newId = (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString();
      setUsers([...users, { ...formData, id: newId }]);
    }

    // Reset form
    resetForm();
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    });
    setEditingUserId(null);
    setShowAddUserForm(false);
    setShowPasswordForm(false);
    setFormError('');
  };

  // Edit user
  const handleEditUser = (user: UserType) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status || 'active'
    });
    setEditingUserId(user.id);
    setShowAddUserForm(true);
    setShowPasswordForm(false);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Toggle user status
  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  // Get role display name in Arabic
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'admin': return 'مدير النظام';
      case 'manager': return 'مدير';
      case 'driver': return 'سائق';
      case 'user': return 'مستخدم';
      default: return role;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-fade-in">
        {/* User Management */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            إدارة المستخدمين
          </h2>
          <button
            onClick={() => {
              resetForm();
              setShowAddUserForm(true);
            }}
            className="px-3 py-1 rounded-md bg-[#1a1a1a] text-white hover:bg-[#333333] dark:bg-[#1a1a1a] dark:hover:bg-[#333333] flex items-center transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            إضافة مستخدم
          </button>
        </div>

        {/* Search and filter */}
        <div className="card-bg rounded-lg shadow mb-6 bg-white dark:bg-[#101010]">
          <div className="p-4">
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full p-2 ps-10 text-gray-900 rounded-lg bg-gray-50 focus:ring-[#333333] focus:border-[#333333] dark:bg-[#1a1a1a] dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#333333] dark:focus:border-[#333333] border-0"
                  placeholder="البحث عن مستخدم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users table */}
        <div className="card-bg rounded-lg shadow overflow-hidden bg-white dark:bg-[#101010]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    الاسم
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    البريد الإلكتروني
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    الصلاحية
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-transparent">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 
                          user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' : 
                          user.role === 'driver' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : 
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200'}`}>
                        {user.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-[#1a1a1a] hover:text-[#333333] dark:text-gray-300 dark:hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`
                            ${user.status === 'active' 
                              ? 'text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300' 
                              : 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'}
                          `}
                        >
                          {user.status === 'active' ? <UserX className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-10">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا يوجد مستخدمين</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  لم يتم العثور على مستخدمين مطابقين للبحث.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit User Form Modal */}
        {showAddUserForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
              className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
              onClick={() => resetForm()}
            >
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-[#040404] opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div 
                className="inline-block align-bottom card-bg rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6 bg-white dark:bg-[#101010]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {editingUserId ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {formError && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm p-3 rounded flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span>{formError}</span>
                    </div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المستخدم"
                      className="mt-1 block w-full rounded-lg shadow-sm bg-white text-gray-900 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-transparent py-3 h-12 px-4 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@domain.com"
                      className="mt-1 block w-full rounded-lg shadow-sm bg-white text-gray-900 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-transparent py-3 h-12 px-4 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع المستخدم</label>
                    <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg shadow-sm bg-white text-gray-900 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-transparent py-3 h-12 px-4 appearance-none bg-no-repeat bg-right pr-10"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", backgroundPosition: "right 0.5rem center" }}
                    >
                      <option value="user">مستخدم</option>
                      <option value="admin">مدير النظام</option>
                      <option value="manager">مدير</option>
                      <option value="driver">سائق</option>
                    </select>
                  </div>
                  {(!editingUserId || showPasswordForm) && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="mt-1 block w-full rounded-lg shadow-sm bg-white text-gray-900 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-transparent py-3 h-12 px-4 transition-colors"
                          required={!editingUserId}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 dark:text-gray-400 focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {editingUserId && !showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-[#1a1a1a] hover:text-[#333333] dark:text-gray-300 dark:hover:text-white flex items-center text-sm"
                    >
                      <Key className="w-4 h-4 mr-1" />
                      تغيير كلمة المرور
                    </button>
                  )}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
                    <select
                      name="status"
                      id="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg shadow-sm bg-white text-gray-900 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-transparent py-3 h-12 px-4 appearance-none bg-no-repeat bg-right pr-10"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", backgroundPosition: "right 0.5rem center" }}
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 ml-2 rounded-md bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525] inline-flex items-center transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="px-4 py-2 ml-2 mr-2 rounded-md bg-[#101010] text-white hover:bg-[#252525] dark:bg-[#1a1a1a] dark:hover:bg-[#252525] inline-flex items-center transition-colors"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {editingUserId ? 'تحديث' : 'إضافة'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;