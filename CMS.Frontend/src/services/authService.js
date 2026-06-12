import axiosClient from '../api/axiosClient';

const authService = {
  // Đăng nhập khách hàng
  login: (email, password) => {
    return axiosClient.post('/CustomersApi/login', { email, password });
  },

  // Đăng ký khách hàng mới
  register: (customerData) => {
    const payload = {
      fullName: customerData.fullName,
      email: customerData.email,
      password: customerData.password,
      phone: customerData.phone || '',
      address: customerData.address || '',
    };
    return axiosClient.post('/CustomersApi', payload);
  }
};

export default authService;
