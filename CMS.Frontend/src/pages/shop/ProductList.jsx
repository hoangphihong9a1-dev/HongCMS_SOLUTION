import ProductCard from '../../components/ProductCard';
import './ProductList.css';

export default function ProductList({ products }) {
  return (
    <div className="shop-product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
