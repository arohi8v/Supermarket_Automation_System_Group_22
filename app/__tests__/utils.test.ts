// utils.test.ts

import { calculateTotal } from '../utils/utils';
import { Item } from '../utils/utils';

describe('calculateTotal', () => {
  test('calculates the total price correctly', () => {
    const items: Item[] = [
      { id: 1, name: 'Milk', price: 2.99, quantity: 10 },
      { id: 2, name: 'Bread', price: 1.99, quantity: 5 }
    ];
    expect(calculateTotal(items)).toBeCloseTo(39.85, 2); // Update expected value
  });
});
