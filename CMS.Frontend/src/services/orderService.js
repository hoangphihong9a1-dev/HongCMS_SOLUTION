import axiosClient from '../api/axiosClient';

const orderService = {
  // Lấy danh sách khách hàng để kiểm tra trùng email
  getCustomers: () => {
    return axiosClient.get('/CustomersApi');
  },

  // Tạo khách hàng mới
  createCustomer: (customerData) => {
    // Đảm bảo mật khẩu mặc định nếu chưa có
    const payload = {
      fullName: customerData.fullName,
      email: customerData.email,
      phone: customerData.phone || '',
      address: customerData.address || '',
      password: customerData.password || '123456', // Mật khẩu mặc định
    };
    return axiosClient.post('/CustomersApi', payload);
  },

  // Tạo đơn hàng mới
  createOrder: (orderData) => {
    // Đảm bảo cấu trúc gửi lên khớp Entity C# (Status = 0: Chờ duyệt)
    const payload = {
      orderDate: new Date().toISOString(),
      customerId: orderData.customerId,
      status: 0,
      notes: orderData.notes || '',
      orderDetails: orderData.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };
    return axiosClient.post('/OrdersApi', payload);
  }
};

export default orderService;
