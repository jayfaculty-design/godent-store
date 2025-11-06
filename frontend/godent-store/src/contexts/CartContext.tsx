import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { AuthContext } from "./AuthContext";

interface ProductsProps {
  category: string;
  description: string;
  id: number;
  images: string[];
  name: string;
  price: string;
  size: string;
  stock: number;
  brand: string;
  category_name: string;
  brand_name: string;
  quantity: number;
}

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, loading: authLoading } = useContext(AuthContext);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart");
      setErrorMessage("");
      setCart(response.data);
    } catch (err) {
      console.log("Error getting cart", err);
      setErrorMessage("Error getting cart, refresh page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchCart();
    }
  }, [user, authLoading]);

  const addToCart = async (product: ProductsProps) => {
    try {
      const response = await api.post("/cart", {
        productId: product.id,
        quantity: 1,
      });
      const data = await response.data;

      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(`Login or Refresh to add to cart`);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const response = await api.delete(`/cart`, {
        data: {
          productId,
        },
      });

      const data = await response.data;

      if (response.status === 200) {
        setCart((prev) =>
          prev.filter((item: { id: number }) => item.id !== productId)
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Error removing product from cart");
      }
    } catch (error) {
      console.log("Error removing item from cart", error);
      toast.error("Error removing item from cart");
    }
  };

  // increment quantity
  const increment = async (productId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      const response = await api.put("/cart", { productId, quantity: newQty });

      const data = await response.data;

      if (response.status === 200) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQty } : item
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // decrement
  const decrement = async (productId: number, newQty: number) => {
    // prevent negative values
    if (newQty < 1) return;
    try {
      const response = await api.put("/cart", { productId, quantity: newQty });

      const data = await response.data;

      if (response.status === 200) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQty } : item
          )
        );
        console.log(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // clear cart
  const clearCart = async () => {
    try {
      const response = await api.delete("/cart");
      const data = await response.data;
      if (response.status === 200) {
        setCart([]);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        removeFromCart,
        addToCart,
        increment,
        decrement,
        loading,
        errorMessage,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
