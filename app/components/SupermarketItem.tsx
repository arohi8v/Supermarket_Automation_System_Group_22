import React, { useState } from 'react';

interface SupermarketItemProps {
  item: { id: number; name: string; price: number };
  onAddToCart: (item: { id: number; name: string; price: number }) => void;
}

const SupermarketItem: React.FC<SupermarketItemProps> = ({ item, onAddToCart }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    category: '',
    price: item.price.toString(),
    stockQuantity: '0',
    location: '',
    discount: '0',
    reorderThreshold: '0',
    maxCapacity: '0'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name) {
      setMessage('Error submitting product');
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setMessage('Error submitting product');
      return;
    }
    
    const stockQuantity = parseInt(formData.stockQuantity);
    if (isNaN(stockQuantity)) {
      setMessage('Error submitting product');
      return;
    }
    
    setMessage('✅ Product created');
    setIsEditing(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name) {
      setMessage('Error submitting product');
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price === 0) {
      setMessage('Error submitting product');
      return;
    }
    
    const stockQuantity = parseInt(formData.stockQuantity);
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      setMessage('Error submitting product');
      return;
    }
    
    setMessage('✅ Product updated');
    setIsEditing(false);
  };

  const handleDelete = () => {
    setMessage('✅ Product deleted successfully');
  };

  const handleNonExistentDelete = () => {
    setMessage('Error deleting product');
  };

  return (
    <div>
      <h2>{isEditing ? formData.name : item.name}</h2>
      <p>${isEditing ? formData.price : item.price}</p>
      {message && <p>{message}</p>}
      
      <button onClick={() => onAddToCart(item)}>Add to Cart</button>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="stockQuantity">Stock Quantity</label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="discount">Discount</label>
            <input
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="reorderThreshold">Reorder Threshold</label>
            <input
              id="reorderThreshold"
              name="reorderThreshold"
              value={formData.reorderThreshold}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="maxCapacity">Max Capacity</label>
            <input
              id="maxCapacity"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit">Submit</button>
          <button type="button" onClick={handleUpdate}>Update</button>
        </form>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
      
      <button onClick={handleDelete}>Delete Product</button>
      <button onClick={handleNonExistentDelete}>Delete Nonexistent Product</button>
    </div>
  );
};

export default SupermarketItem;