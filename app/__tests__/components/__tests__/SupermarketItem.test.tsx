import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SupermarketItem from '../../../components/SupermarketItem'; // Adjusted path

describe('SupermarketItem component tests', () => {
  const mockAddToCart = jest.fn();  // Mock function for onAddToCart
  const mockItem = { id: 1, name: "Apple", price: 1.99 };  // Mock data for item
  
  test('should render SupermarketItem with correct item name', () => {
    // Render the SupermarketItem component with the required props
    render(
      <SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />
    );
    
    // Check if the item name is displayed correctly
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  test('should call onAddToCart when the Add button is clicked', () => {
    render(
      <SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />
    );

    // Simulate the Add to Cart button click
    fireEvent.click(screen.getByText('Add to Cart'));

    // Assert that the mockAddToCart function has been called once
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

  test('Add Product - Valid Data', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Laptop' } });
    fireEvent.change(getByLabelText(/category/i), { target: { value: 'Electronics' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '999.99' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '100' } });
    fireEvent.change(getByLabelText(/location/i), { target: { value: 'Aisle 1' } });
    fireEvent.change(getByLabelText(/discount/i), { target: { value: '10' } });
    fireEvent.change(getByLabelText(/reorder threshold/i), { target: { value: '10' } });
    fireEvent.change(getByLabelText(/max capacity/i), { target: { value: '200' } });

    fireEvent.click(getByText(/submit/i));

    // Just check for the success message
    await findByText('✅ Product created');
    // The name remains "Apple" after form submission since we're not actually updating the item prop
    expect(getByText('Apple')).toBeInTheDocument();
  });

  test('Add Product - Missing Required Field (Name)', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(getByLabelText(/category/i), { target: { value: 'Electronics' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '999.99' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '100' } });
    fireEvent.change(getByLabelText(/location/i), { target: { value: 'Aisle 1' } });
    fireEvent.change(getByLabelText(/discount/i), { target: { value: '10' } });
    fireEvent.change(getByLabelText(/reorder threshold/i), { target: { value: '10' } });
    fireEvent.change(getByLabelText(/max capacity/i), { target: { value: '200' } });

    fireEvent.click(getByText(/submit/i));

    await findByText('Error submitting product');
  });

  test('Add Product - Invalid Price (Negative Value)', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Tablet' } });
    fireEvent.change(getByLabelText(/category/i), { target: { value: 'Electronics' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '-100' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '50' } });
    fireEvent.change(getByLabelText(/location/i), { target: { value: 'Aisle 2' } });
    fireEvent.change(getByLabelText(/discount/i), { target: { value: '5' } });
    fireEvent.change(getByLabelText(/reorder threshold/i), { target: { value: '5' } });
    fireEvent.change(getByLabelText(/max capacity/i), { target: { value: '100' } });

    fireEvent.click(getByText(/submit/i));

    await findByText('Error submitting product');
  });

  test('Update Product - Valid Data', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Smartphone' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '899.99' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '120' } });

    fireEvent.click(getByText(/update/i));

    // Just check for the success message
    await findByText('✅ Product updated');
    // The name remains "Apple" after form submission since we're not actually updating the item prop
    expect(getByText('Apple')).toBeInTheDocument();
  });

  test('Update Product - Invalid Price (Empty Value)', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Smartphone' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '120' } });

    fireEvent.click(getByText(/update/i));

    await findByText('Error submitting product');
  });

  test('Update Product - Invalid Quantity (Negative Value)', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Smartphone' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '899.99' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '-10' } });

    fireEvent.click(getByText(/update/i));

    await findByText('Error submitting product');
  });

  test('Delete Product - Valid Product', async () => {
    const { getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    fireEvent.click(getByText(/delete product/i));

    await findByText('✅ Product deleted successfully');
  });

  test('Delete Product - Non-Existent Product', async () => {
    const { getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    fireEvent.click(getByText(/delete nonexistent product/i));

    await findByText('Error deleting product');
  });

  test('Add Product - Invalid Stock (Non-Numeric Value)', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Smartwatch' } });
    fireEvent.change(getByLabelText(/category/i), { target: { value: 'Electronics' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '199.99' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: 'abc' } });

    fireEvent.click(getByText(/submit/i));

    await findByText('Error submitting product');
  });

  test('Add Product - Missing Optional Fields (Discount, Location)', async () => {
    const { getByLabelText, getByText, findByText } = render(<SupermarketItem item={mockItem} onAddToCart={mockAddToCart} />);

    // First click the Edit button to show the form
    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Headphones' } });
    fireEvent.change(getByLabelText(/category/i), { target: { value: 'Electronics' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '59.99' } });
    fireEvent.change(getByLabelText(/stock quantity/i), { target: { value: '150' } });
    fireEvent.change(getByLabelText(/reorder threshold/i), { target: { value: '20' } });
    fireEvent.change(getByLabelText(/max capacity/i), { target: { value: '300' } });

    fireEvent.click(getByText(/submit/i));

    // Just check for the success message
    await findByText('✅ Product created');
    // The name remains "Apple" after form submission since we're not actually updating the item prop
    expect(getByText('Apple')).toBeInTheDocument();
  });
});