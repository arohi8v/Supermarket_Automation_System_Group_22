// api.test.ts

import { fetchProducts, createOrder } from '../api/api'; // Adjusted path

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('fetchProducts calls correct endpoint and returns data', async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue([
        { id: 1, name: 'Bread', price: 1.99 },
        { id: 2, name: 'Milk', price: 2.49 }
      ])
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const products = await fetchProducts();

    expect(global.fetch).toHaveBeenCalledWith('/api/products');
    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('Bread');
  });

  test('createOrder sends correct data to API', async () => {
    const mockOrder = {
      items: [{ productId: 1, quantity: 2 }],
      totalAmount: 3.98
    };

    const mockResponse = {
      json: jest.fn().mockResolvedValue({ id: 123, status: 'created' })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await createOrder(mockOrder);

    expect(global.fetch).toHaveBeenCalledWith('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockOrder)
    });
  });
});
