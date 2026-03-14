import React, { useEffect, useState } from 'react';
import { EditorialGrid, GridBlock } from '../components/layout/EditorialGrid';
import { dashboardApi } from '../services/api';
import { AlertOctagon, TrendingUp, Package, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px' }}><h1 className="mega-text">LOADING...</h1></div>;

  return (
    <div>
      <EditorialGrid>
        {/* Massive Manifesto Block */}
        <GridBlock colSpan={4} rowSpan={2} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fafafa' }}>
          <div>
            <h1 className="mega-text" style={{ maxWidth: '800px', marginBottom: '24px' }}>
              FEEL YOUNG,<br/>BE UNSTOPPABLE.
            </h1>
            <p style={{ fontWeight: 500, fontSize: '1.2rem', maxWidth: '500px' }}>
              Bawal Admin Dashboard. Complete control over your inventory, orders, and street culture dominance.
            </p>
          </div>
        </GridBlock>

        {/* Vital Stats */}
        <GridBlock colSpan={1} hoverable>
          <p className="grid-block-header">TOTAL PRODUCTS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span style={{ fontSize: '4rem', fontWeight: 900 }}>{stats?.totalProducts || 0}</span>
            <Package size={32} strokeWidth={1.5} color="var(--text-muted)" />
          </div>
        </GridBlock>

        <GridBlock colSpan={1} hoverable>
          <p className="grid-block-header">TOTAL ORDERS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span style={{ fontSize: '4rem', fontWeight: 900 }}>{stats?.totalOrders || 0}</span>
            <Users size={32} strokeWidth={1.5} color="var(--text-muted)" />
          </div>
        </GridBlock>

        <GridBlock colSpan={2} neonHover style={{ transition: 'all 0.3s' }}>
          <p className="grid-block-header">TOTAL REVENUE</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span style={{ fontSize: '4rem', fontWeight: 900 }}>₹{stats?.totalRevenue || 0}</span>
            <TrendingUp size={32} strokeWidth={1.5} />
          </div>
        </GridBlock>

        {/* Low Stock Alerts - Spanning 2 columns wide, 2 rows deep to draw attention */}
        <GridBlock colSpan={2} rowSpan={2} style={{ borderLeft: stats?.lowStockCount > 0 ? '8px solid var(--accent-red)' : '' }}>
          <div className="flex-wrap-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem' }}>STOCK ALERTS</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {stats?.lowStockCount > 0 && <AlertOctagon color="var(--accent-red)" />}
              <span className={`bawal-badge ${stats?.lowStockCount > 0 ? 'alert' : ''}`}>
                {stats?.lowStockCount} LOW STOCK
              </span>
            </div>
          </div>

          {stats?.lowStockAlerts?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.lowStockAlerts.map(alert => (
                <div key={alert.variantId} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{alert.productName}</h4>
                    <span className="bawal-badge">{alert.sku}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--accent-red)' }}>{alert.currentStock}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>LEFT IN STOCK</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', paddingTop: '40px' }}>All inventory levels are looking solid. No alerts.</p>
          )}
        </GridBlock>

        {/* Recent Orders - Minimalist Editorial Table */}
        <GridBlock colSpan={2} rowSpan={2}>
           <div className="flex-wrap-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem' }}>RECENT ORDERS</h2>
            <button className="bawal-button-outline">VIEW ALL</button>
          </div>
          
          <table className="bawal-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.id}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalAmount}</td>
                  <td>
                    <span className="bawal-badge" style={{ 
                      background: order.status === 'DELIVERED' ? 'var(--text-muted)' : 
                                  order.status === 'PENDING' ? 'var(--accent-neon)' : '#000',
                      color: order.status === 'PENDING' ? '#000' : '#fff'
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GridBlock>

      </EditorialGrid>
    </div>
  );
};

export default Dashboard;
