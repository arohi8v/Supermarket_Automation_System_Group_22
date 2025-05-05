// utils.ts

export type Item = {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  
  export const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };
  
  export const calculateTotal = (items: Item[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  