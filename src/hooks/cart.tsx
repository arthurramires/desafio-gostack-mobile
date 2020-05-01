import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
     const product = await AsyncStorage.getItem('@GoMarketplace:product');
     setProducts([...products, JSON.parse(product)]);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async (product:Product) => {
    // const findProducts = products.filter(prod => {
    //   return prod.id === product.id;
    // })

    // if (findProducts){
    //   return;
        // const incrementProduct = findProducts.find(prod => {
        //   return prod.id === product.id;
        // })

        // setProducts([...products, incrementProduct])
    // }
    await AsyncStorage.setItem('@GoMarketplace:product', JSON.stringify(product));
    setProducts([...products, product]);
  }, []);

  const increment = useCallback(async id => {

      const prod = products.find((product) => {
        return product.id === id;
      })
      if (prod) {
        return prod.quantity + 1;
      }

  }, []);

  const decrement = useCallback(async id => {

      const prod = products.find((product) => {
        return product.id === id;
      })
      if (prod) {
        return prod.quantity - 1;
      }

  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
