import React, { useState, useEffect } from 'react';
import { EditorialGrid, GridBlock } from '../components/layout/EditorialGrid';
import { productsApi, variantsApi } from '../services/api';
import { uploadImage, saveProductImage } from '../services/cloudinary';
import { Plus, Image as ImageIcon, Check } from 'lucide-react';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState({ S: false, M: false, L: false, XL: false, XXL: false });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    productsApi.getAll()
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSizeToggle = (size) => {
    setSizes(prev => ({ ...prev, [size]: !prev[size] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      // 1. Create Product
      const product = await productsApi.create({ name, description, price: parseFloat(price) });
      
      // 2. Create Variants for selected sizes
      for (const [size, isSelected] of Object.entries(sizes)) {
        if (isSelected) {
          await variantsApi.create({ productId: product.id, size });
        }
      }

      // 3. Upload Image to Cloudinary & Save to backend
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        await saveProductImage(product.id, imageUrl, 'FRONT');
      }

      // Reset form and reload
      setName('');
      setDescription('');
      setPrice('');
      setSizes({ S: false, M: false, L: false, XL: false, XXL: false });
      setImageFile(null);
      loadProducts();
      
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading && products.length === 0) return <div style={{ padding: '40px' }}><h1 className="mega-text">LOADING...</h1></div>;

  return (
    <div>
      <EditorialGrid>
        
        {/* Header Block */}
        <GridBlock colSpan={4} style={{ backgroundColor: '#000', color: '#fff' }}>
          <h1 className="mega-text" style={{ color: 'var(--accent-neon)' }}>CATALOG</h1>
          <p style={{ marginTop: '16px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Manage the Bawal collection. Add drops, manage variants, upload lookbook imagery.
          </p>
        </GridBlock>

        {/* Create Product Form */}
        <GridBlock colSpan={2} rowSpan={2}>
          <p className="grid-block-header">NEW DROP / PRODUCT</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <label className="bawal-label">Product Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} 
                     className="bawal-input" placeholder="e.g. MONDAY MOOD TEE" />
            </div>

            <div>
              <label className="bawal-label">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)}
                        className="bawal-input" placeholder="Oversized fit, heavy cotton..." 
                        style={{ minHeight: '80px', resize: 'vertical' }} />
            </div>

            <div>
              <label className="bawal-label">Price (₹)</label>
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)}
                     className="bawal-input" placeholder="799" />
            </div>

            <div>
              <label className="bawal-label">Initial Sizes Available</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.keys(sizes).map(size => (
                  <button type="button" key={size} onClick={() => handleSizeToggle(size)}
                    style={{
                      padding: '8px 16px', border: '1px solid #000', fontWeight: 700,
                      background: sizes[size] ? '#000' : 'transparent',
                      color: sizes[size] ? 'var(--accent-neon)' : '#000',
                      transition: 'all 0.2s'
                    }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="bawal-label">Primary Image (Front)</label>
              <div style={{ 
                border: '1px dashed #000', padding: '24px', textAlign: 'center', cursor: 'pointer',
                background: imageFile ? '#fafafa' : 'transparent'
              }}>
                <input type="file" accept="image/*" id="img-upload" style={{ display: 'none' }}
                       onChange={e => setImageFile(e.target.files[0])} />
                <label htmlFor="img-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {imageFile ? <Check size={24} /> : <ImageIcon size={24} />}
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {imageFile ? imageFile.name : 'CLICK TO UPLOAD'}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={uploading} className="bawal-button" style={{ marginTop: '16px' }}>
              {uploading ? 'UPLOADING...' : 'CREATE PRODUCT'}
            </button>

          </form>
        </GridBlock>

        {/* Product List Grid */}
        <GridBlock colSpan={2} rowSpan={2} style={{ overflowY: 'auto', maxHeight: '1000px' }}>
          <div className="flex-wrap-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p className="grid-block-header" style={{ marginBottom: 0 }}>CURRENT COLLECTION</p>
            <span className="bawal-badge">{products.length} ITEMS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {products.map(product => (
              <div key={product.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
                
                {/* Image thumb */}
                <div style={{ width: '100px', height: '120px', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0].imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                     <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <ImageIcon color="var(--border-color)" />
                     </div>
                  )}
                </div>
                
                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{product.name}</h3>
                    <span style={{ fontWeight: 900 }}>₹{product.price}</span>
                  </div>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {product.variants?.map(v => (
                      <span key={v.id} title={`SKU: ${v.sku}`} className="bawal-badge" style={{ backgroundColor: v.stock === 0 ? 'var(--text-muted)' : '#000' }}>
                        {v.size} ({v.stock})
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
            {products.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Collection is empty.</p>
            )}
          </div>
        </GridBlock>

      </EditorialGrid>
    </div>
  );
};

export default ProductsManager;
