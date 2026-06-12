import { useEffect, useState } from 'react';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import productService from '../../services/productService';
import blogService from '../../services/blogService';
import './index.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [prodData, catData, postData] = await Promise.all([
          productService.getAllProducts().catch(() => []),
          productService.getCategories().catch(() => []),
          blogService.getAllPosts().catch(() => [])
        ]);

        setProducts(prodData || []);
        setCategories(catData || []);
        setPosts(postData || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="shop-loading-screen">
        <div className="shop-loading-spinner"></div>
        <p>Đang tải trang chủ...</p>
      </div>
    );
  }

  return (
    <div className="home-page-container">
      <HeroBanner />
      <CategoryMenu categories={categories} />
      <ProductGrid products={products} />
      <LatestBlog posts={posts} />
    </div>
  );
}
