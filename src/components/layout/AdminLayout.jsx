import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ 
        marginLeft: 'var(--sidebar-width)', 
        flex: 1, 
        width: 'calc(100% - var(--sidebar-width))',
        paddingTop: '60px' // Offset to push grid down slightly for breathing room
      }}>
        {/* Sub-header area for page titles could go here, but we will put it inside the grid */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 60px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
