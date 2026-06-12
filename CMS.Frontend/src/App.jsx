import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ShopLayout from './layouts/ShopLayout';

// Store Pages
import Home from './pages/home';
import Shop from './pages/shop';
import ProductDetail from './pages/product';
import Blog from './pages/blog';
import BlogDetail from './pages/blog/detail';
import Cart from './pages/cart';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';

const router = createBrowserRouter([
  // Public Storefront Routes
  {
    path: '/',
    element: <ShopLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:id', element: <BlogDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <RouterProvider router={router} />
      </BlogProvider>
    </AuthProvider>
  );
}
