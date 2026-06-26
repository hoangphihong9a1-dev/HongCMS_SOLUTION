import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';
import productService from '../../services/productService';
import './index.css';

export default function Shop() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // States bộ lọc & sắp xếp
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(50000000); // Mặc định 50 triệu
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Reset trang về 1 khi thay đổi bộ lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortBy, searchTerm]);

  // Đọc params từ URL (?category=X hoặc ?search=Y)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const catParam = query.get('category');
    const searchParam = query.get('search');

    if (catParam) {
      setSelectedCategory(Number(catParam));
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          productService.getAllProducts().catch(() => []),
          productService.getCategories().catch(() => [])
        ]);
        setProducts(prodData || []);
        setCategories(catData || []);
      } catch (err) {
        console.error('Error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  // Xử lý Lọc & Sắp xếp
  const filteredProducts = products
    .filter(prod => {
      const matchCat = !selectedCategory || prod.categoryProductId === selectedCategory;
      const matchPrice = prod.price <= priceRange;
      const matchSearch = !searchTerm || prod.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // default (mặc định)
    });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="shop-page-wrap">
      <div className="shop-layout-container">
        <ShopSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <div className="shop-main-content">
          <ShopHeader
            totalCount={filteredProducts.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <LoadingOrEmpty
            loading={loading}
            isEmpty={filteredProducts.length === 0}
          />

          {!loading && filteredProducts.length > 0 && (
            <>
              <ProductList products={paginatedProducts} />
              
              {totalPages > 1 && (
                <div className="shop-pagination">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="pag-btn"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`pag-num ${currentPage === idx + 1 ? 'active' : ''}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="pag-btn"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
