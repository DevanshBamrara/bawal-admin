import React, { useState, useEffect } from 'react';
import { EditorialGrid, GridBlock } from '../components/layout/EditorialGrid';
import { ordersApi } from '../services/api';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    ordersApi.getAll()
      .then(data => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ordersApi.updateStatus(id, newStatus);
      loadOrders(); // refresh
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && orders.length === 0) return <div style={{ padding: '40px' }}><h1 className="mega-text">LOADING...</h1></div>;

  return (
    <div>
      <EditorialGrid>
        
        <GridBlock colSpan={4} style={{ backgroundColor: '#111', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 className="mega-text">ORDERS</h1>
              <p style={{ marginTop: '16px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Fulfillment queue and customer purchases.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--accent-neon)' }}>
                  {orders.filter(o => o.status === 'PENDING').length}
                </div>
                <div className="grid-block-header">PENDING</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '2rem' }}>{orders.length}</div>
                <div className="grid-block-header">TOTAL</div>
              </div>
            </div>
          </div>
        </GridBlock>

        <GridBlock colSpan={4} rowSpan={2} style={{ overflowX: 'auto' }}>
          <table className="bawal-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amnt.</th>
                <th>Date</th>
                <th>Status / Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>#{String(order.id).padStart(5, '0')}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.address}</div>
                  </td>
                  <td>
                    {order.items?.map(item => (
                      <div key={item.id} style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700 }}>{item.quantity}x</span> {item.productName} ({item.size})
                      </div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 900 }}>₹{order.totalAmount}</td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        border: '2px solid',
                        borderColor: order.status === 'DELIVERED' ? '#ccc' : '#000',
                        backgroundColor: order.status === 'PENDING' ? 'var(--accent-neon)' : 
                                         order.status === 'DELIVERED' ? '#fff' : '#000',
                        color: order.status === 'PENDING' ? '#000' : 
                               order.status === 'DELIVERED' ? '#aaa' : '#fff',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    No orders have been placed yet.
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

export default OrdersManager;
