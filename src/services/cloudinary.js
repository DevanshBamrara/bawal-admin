// Uses Cloudinary unsigned upload preset
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'bawal_unsigned');
  
  // Hardcoded for the requested cloud name
  const res = await fetch('https://api.cloudinary.com/v1_1/dn6z0y60z/image/upload', {
    method: 'POST', 
    body: formData
  });
  
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
};

// Sends the uploaded URL to the backend
export const saveProductImage = async (productId, imageUrl, imageType) => {
  const res = await fetch('http://localhost:8080/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, imageUrl, imageType })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to save image');
  return data.data;
};
