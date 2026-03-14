import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsManager from './pages/ProductsManager';
import InventoryManager from './pages/InventoryManager';
import OrdersManager from './pages/OrdersManager';
import Login from './pages/Login';
import './index.css';

const MainRouter = () => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, render the Login screen instead of the router
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="inventory" element={<InventoryManager />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="movements" element={<InventoryManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}

export default App;
