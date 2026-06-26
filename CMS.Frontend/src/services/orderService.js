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
  },

  // Lấy danh sách đơn hàng của một khách hàng
  getCustomerOrders: (customerId) => {
    return axiosClient.get(`/OrdersApi/customer/${customerId}`);
  },

  // Cập nhật đơn hàng (sửa ghi chú, số lượng sản phẩm, hoặc hủy đơn)
  updateOrder: (id, orderData) => {
    const payload = {
      id: id,
      customerId: orderData.customerId,
      status: orderData.status,
      notes: orderData.notes || '',
      orderDate: orderData.orderDate,
      customer: orderData.customer ? {
        id: orderData.customer.id,
        fullName: orderData.customer.fullName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        address: orderData.customer.address,
        password: orderData.customer.password || ""
      } : null,
      orderDetails: orderData.orderDetails.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };
    return axiosClient.put(`/OrdersApi/${id}`, payload);
  }
};

export default orderService;
