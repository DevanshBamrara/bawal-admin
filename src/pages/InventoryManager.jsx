import React, { useState, useEffect } from 'react';
import { EditorialGrid, GridBlock } from '../components/layout/EditorialGrid';
import { productsApi, inventoryApi } from '../services/api';
import { ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';

const InventoryManager = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stock Form State
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState('IN'); // 'IN' or 'OUT'

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsData, movesData] = await Promise.all([
        productsApi.getAll(),
        inventoryApi.getMovements()
      ]);
      setProducts(prodsData);
      setMovements(movesData);
      
      // Auto-select first variant if none selected
      if (!selectedVariantId && prodsData.length > 0 && prodsData[0].variants?.length > 0) {
        setSelectedVariantId(prodsData[0].variants[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { variantId: parseInt(selectedVariantId), quantity: parseInt(quantity), reason: reason || `Manual Stock ${action}` };
      
      if (action === 'IN') {
        await inventoryApi.stockIn(payload);
      } else {
        await inventoryApi.stockOut(payload);
      }
      
      setQuantity('');
      setReason('');
      loadData(); // Refresh everything
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && products.length === 0) return <div style={{ padding: '40px' }}><h1 className="mega-text">LOADING...</h1></div>;

  return (
    <div>
      <EditorialGrid>
        
        {/* Header Block */}
        <GridBlock colSpan={4} style={{ backgroundColor: 'var(--accent-neon)', color: '#000' }}>
          <h1 className="mega-text">INVENTORY</h1>
          <p style={{ marginTop: '16px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Stock movement, level adjustments, and logistics control center.
          </p>
        </GridBlock>

        {/* Stock Update Form */}
        <GridBlock colSpan={2} rowSpan={1}>
          <p className="grid-block-header">STOCK MOVEMENT</p>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button onClick={() => setAction('IN')} style={{ 
              flex: 1, padding: '12px', fontWeight: 900, border: '2px solid #000',
              background: action === 'IN' ? '#000' : 'transparent', color: action === 'IN' ? 'var(--accent-neon)' : '#000'
            }}>
               IN (+)
            </button>
            <button onClick={() => setAction('OUT')} style={{ 
              flex: 1, padding: '12px', fontWeight: 900, border: '2px solid #000',
              background: action === 'OUT' ? '#000' : 'transparent', color: action === 'OUT' ? '#fff' : '#000'
            }}>
               OUT (-)
            </button>
          </div>

          <form onSubmit={handleStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label className="bawal-label">Select Variant (SKU)</label>
              <select className="bawal-input" required value={selectedVariantId} onChange={e => setSelectedVariantId(e.target.value)} style={{ padding: '8px 0', borderBottom: '2px solid var(--border-color)', outline: 'none' }}>
                <option value="" disabled>Choose a variant...</option>
                {products.map(p => 
                  p.variants?.map(v => (
                    <option key={v.id} value={v.id}>{p.name} - {v.size} (Current: {v.stock})</option>
                  ))
                )}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="bawal-label">Quantity</label>
                <input required type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="bawal-input" placeholder="e.g. 50" />
              </div>
              <div style={{ flex: 2 }}>
                <label className="bawal-label">Reason (Optional)</label>
                <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="bawal-input" placeholder={action === 'IN' ? "New shipment" : "Damaged / Manual fix"} />
              </div>
            </div>

            <button type="submit" className="bawal-button" style={{ marginTop: '8px' }}>
              CONFIRM STOCK {action}
            </button>

          </form>
        </GridBlock>

        {/* Movement History Log */}
        <GridBlock colSpan={2} rowSpan={2} style={{ overflowY: 'auto', maxHeight: '800px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem' }}>MOVEMENT LOG</h2>
            <Activity />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {movements.map((move, i) => (
              <div key={move.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0',
                borderBottom: i !== movements.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}>
                <div style={{ 
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: move.type === 'IN' ? 'var(--bg-color)' : '#000',
                  color: move.type === 'IN' ? '#000' : 'var(--accent-neon)',
                  border: move.type === 'IN' ? '1px solid #e5e5e5' : 'none'
                }}>
                  {move.type === 'IN' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700 }}>{move.productName} ({move.size})</span>
                    <span style={{ fontWeight: 900, color: move.type === 'OUT' ? 'var(--accent-red)' : 'inherit' }}>
                      {move.type === 'IN' ? '+' : '-'}{move.quantity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{move.reason}</span>
                    <span>{new Date(move.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {movements.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '40px' }}>No stock movements recorded yet.</p>
            )}
          </div>
        </GridBlock>
        
        {/* Quick Stock Overview Matrix */}
        <GridBlock colSpan={2} rowSpan={1}>
           <p className="grid-block-header">STOCK MATRIX QUICK VIEW</p>
           <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '8px', borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '16px', fontSize: '0.75rem', fontWeight: 700 }}>
             <div>PRODUCT</div>
             <div style={{textAlign: 'center'}}>S</div>
             <div style={{textAlign: 'center'}}>M</div>
             <div style={{textAlign: 'center'}}>L</div>
             <div style={{textAlign: 'center'}}>XL</div>
             <div style={{textAlign: 'center'}}>XXL</div>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {products.slice(0, 5).map(product => {
               // Map variants to a dictionary for easy access
               const sizeMap = product.variants?.reduce((acc, curr) => ({ ...acc, [curr.size]: curr.stock }), {}) || {};
               
               return (
                 <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                   <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                   {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                     <div key={size} style={{
                       textAlign: 'center', 
                       backgroundColor: sizeMap[size] === undefined ? 'transparent' : (sizeMap[size] <= 5 ? (sizeMap[size] === 0 ? '#f0f0f0' : '#ffe1e1') : '#f5ffe6'),
                       color: sizeMap[size] === undefined ? 'transparent' : (sizeMap[size] === 0 ? '#bbb' : '#000'),
                       fontWeight: 700,
                       border: sizeMap[size] !== undefined ? '1px solid #eee' : 'none'
                     }}>
                       {sizeMap[size] !== undefined ? sizeMap[size] : '-'}
                     </div>
                   ))}
                 </div>
               )
             })}
           </div>
        </GridBlock>

      </EditorialGrid>
    </div>
  );
};

export default InventoryManager;
