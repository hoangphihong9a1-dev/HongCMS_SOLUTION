import { createContext, useContext, useState, useCallback } from 'react';

const initialCategories = [
  { id: 1, name: 'Điện tử & Công nghệ', slug: 'dien-tu', description: 'Thiết bị điện tử, gadget, phụ kiện', status: 'active' },
  { id: 2, name: 'Thời trang & Phong cách', slug: 'thoi-trang', description: 'Quần áo, giày dép, phụ kiện thời trang', status: 'active' },
  { id: 3, name: 'Thực phẩm & Đồ uống', slug: 'thuc-pham', description: 'Đồ ăn, thức uống, thực phẩm chức năng', status: 'active' },
  { id: 4, name: 'Gia dụng & Nội thất', slug: 'gia-dung', description: 'Đồ gia dụng, nội thất, trang trí nhà', status: 'active' },
  { id: 5, name: 'Sức khoẻ & Làm đẹp', slug: 'suc-khoe', description: 'Mỹ phẩm, chăm sóc sức khoẻ', status: 'active' },
  { id: 6, name: 'Thể thao & Ngoài trời', slug: 'the-thao', description: 'Dụng cụ thể thao, outdoor', status: 'inactive' },
];

const initialProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', categoryId: 1, price: '34.990.000đ', stock: 42, rating: 4.9, status: 'active' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', categoryId: 1, price: '28.500.000đ', stock: 18, rating: 4.7, status: 'active' },
  { id: 3, name: 'Laptop Dell XPS 15', categoryId: 1, price: '42.000.000đ', stock: 7, rating: 4.8, status: 'active' },
  { id: 4, name: 'Áo thun basic unisex', categoryId: 2, price: '250.000đ', stock: 230, rating: 4.3, status: 'active' },
  { id: 5, name: 'Quần jean slim fit', categoryId: 2, price: '580.000đ', stock: 95, rating: 4.5, status: 'active' },
  { id: 6, name: 'Cà phê hảo hạng Đà Lạt', categoryId: 3, price: '120.000đ', stock: 0, rating: 4.6, status: 'out_of_stock' },
  { id: 7, name: 'Nồi cơm điện Sunhouse', categoryId: 4, price: '1.200.000đ', stock: 33, rating: 4.4, status: 'active' },
  { id: 8, name: 'AirPods Pro 2nd Gen', categoryId: 1, price: '5.990.000đ', stock: 65, rating: 4.8, status: 'active' },
];

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Category CRUD
  const addCategory = useCallback((cat) => {
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories(prev => [...prev, { ...cat, id: newId, slug: cat.slug || generateSlug(cat.name) }]);
  }, [categories]);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates, slug: updates.slug || generateSlug(updates.name || c.name) } : c)
    );
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Optionally unassign products - set categoryId to null
    setProducts(prev => prev.map(p => p.categoryId === id ? { ...p, categoryId: null } : p));
  }, []);

  // Get category name by id
  const getCategoryName = useCallback((categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Chưa phân loại';
  }, [categories]);

  // Count products in a category
  const getProductCount = useCallback((categoryId) => {
    return products.filter(p => p.categoryId === categoryId).length;
  }, [products]);

  // Product CRUD
  const addProduct = useCallback((product) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts(prev => [...prev, { ...product, id: newId }]);
  }, [products]);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <CategoryContext.Provider value={{
      categories,
      products,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryName,
      getProductCount,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
}
