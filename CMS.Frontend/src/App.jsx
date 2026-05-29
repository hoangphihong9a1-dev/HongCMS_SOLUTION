import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import ProductCategoriesPage from './pages/ProductCategoriesPage';
import CategoriesPage from './pages/CategoriesPage';
import PostsPage from './pages/PostsPage';
import UsersPage from './pages/UsersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'product-categories', element: <ProductCategoriesPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'posts', element: <PostsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
