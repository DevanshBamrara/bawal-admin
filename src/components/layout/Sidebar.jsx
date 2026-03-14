import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Box, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-color)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="bawal-logo-box">
        <h1 className="bawal-logo">BAWAL<sup>TM</sup></h1>
      </div>

      <nav style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p className="grid-block-header">Menu</p>

        <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
           <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        <NavLink to="/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
           <ShoppingBag size={20} /> Products
        </NavLink>
        
        <NavLink to="/inventory" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
           <Box size={20} /> Inventory
        </NavLink>

        <NavLink to="/orders" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
           <Users size={20} /> Orders
        </NavLink>
        
        <NavLink to="/movements" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
           <Activity size={20} /> Stock History
        </NavLink>
      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background: #f5f5f5;
        }
        .nav-link.active {
          background: #000;
          color: var(--accent-neon);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
