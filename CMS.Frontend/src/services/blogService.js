import axiosClient from '../api/axiosClient';

const blogService = {
  // ========== POSTS ==========
  getAllPosts: (categoryId) => {
    const url = categoryId ? `/PostsApi?categoryId=${categoryId}` : '/PostsApi';
    return axiosClient.get(url);
  },
  getPostById: (id) => axiosClient.get(`/PostsApi/${id}`),
  createPost: (post) => axiosClient.post('/PostsApi', post),
  updatePost: (id, post) => axiosClient.put(`/PostsApi/${id}`, post),
  deletePost: (id) => axiosClient.delete(`/PostsApi/${id}`),

  // ========== CATEGORIES ==========
  getCategories: () => axiosClient.get('/CategoriesApi'),
  getCategoryById: (id) => axiosClient.get(`/CategoriesApi/${id}`),
  createCategory: (cat) => axiosClient.post('/CategoriesApi', cat),
  updateCategory: (id, cat) => axiosClient.put(`/CategoriesApi/${id}`, cat),
  deleteCategory: (id) => axiosClient.delete(`/CategoriesApi/${id}`),
};

export default blogService;
