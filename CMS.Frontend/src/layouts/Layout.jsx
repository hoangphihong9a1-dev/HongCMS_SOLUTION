import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CategoryProvider } from '../context/CategoryContext';
import './Layout.css';

export default function Layout() {
  return (
    <CategoryProvider>
      <div className="layout">
        <Sidebar />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </CategoryProvider>
  );
}
