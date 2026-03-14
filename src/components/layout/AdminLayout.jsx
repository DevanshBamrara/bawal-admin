import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      
      {/* Mobile Top Header */}
      <div className="mobile-only" style={{ 
        height: '60px', 
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 16px',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-color)',
        zIndex: 50
      }}>
        <h1 className="bawal-logo" style={{ fontSize: '1.5rem', margin: 0 }}>BAWAL<sup>TM</sup></h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Overlay when sidebar open on mobile */}
        {isSidebarOpen && (
          <div 
            className="mobile-only"
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }} 
          />
        )}
        
        <main className="admin-main">
          <div className="admin-content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
