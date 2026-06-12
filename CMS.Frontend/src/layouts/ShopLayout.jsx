import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import './ShopLayout.css';

export default function ShopLayout() {
  return (
    <CartProvider>
      <div className="shop-layout">
        <Header />
        <main className="shop-layout-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
