import axiosClient from '../api/axiosClient';

const productService = {
  // Lấy tất cả sản phẩm
  getAllProducts: () => {
    return axiosClient.get('/ProductsApi');
  },

  // Lấy chi tiết sản phẩm theo Id
  getProductById: (id) => {
    return axiosClient.get(`/ProductsApi/${id}`);
  },

  // Tạo sản phẩm mới
  createProduct: (product) => {
    return axiosClient.post('/ProductsApi', product);
  },

  // Cập nhật sản phẩm
  updateProduct: (id, product) => {
    return axiosClient.put(`/ProductsApi/${id}`, product);
  },

  // Xóa sản phẩm
  deleteProduct: (id) => {
    return axiosClient.delete(`/ProductsApi/${id}`);
  },

  // Lấy tất cả danh mục sản phẩm
  getCategories: () => {
    return axiosClient.get('/ProductCategoriesApi');
  },

  // Lấy danh mục sản phẩm theo Id
  getCategoryById: (id) => {
    return axiosClient.get(`/ProductCategoriesApi/${id}`);
  },

  // Tạo danh mục sản phẩm mới
  createCategory: (category) => {
    return axiosClient.post('/ProductCategoriesApi', category);
  },

  // Cập nhật danh mục sản phẩm
  updateCategory: (id, category) => {
    return axiosClient.put(`/ProductCategoriesApi/${id}`, category);
  },

  // Xóa danh mục sản phẩm
  deleteCategory: (id) => {
    return axiosClient.delete(`/ProductCategoriesApi/${id}`);
  }
};

export default productService;
