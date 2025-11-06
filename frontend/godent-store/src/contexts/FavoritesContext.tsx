import api from "@/lib/api";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
  useContext,
} from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const FavoriteContext = createContext<any>(null);

export const FavoriteProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, loading: authLoading } = useContext(AuthContext);

  const fetchFavorites = async () => {
    if (!user) return; // only fetch if logged in
    setLoading(true);
    try {
      const response = await api.get("/favorites");
      const data = response.data;
      setErrorMessage("");
      setFavorites(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error getting favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  const addToFavorites = async (product: { id: number }) => {
    try {
      const response = await api.post("/favorites", {
        productId: product.id,
      });
      const data = response.data;

      if (response.status === 200) {
        setFavorites((prev: any) => {
          const exists = prev.find(
            (item: { id: number }) => item.id === product.id
          );
          return exists ? prev : [...prev, product];
        });
        toast.success(data.message || "Added to favorites");
      } else {
        toast.error(data.message || "Error adding to favorites");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding to favorites");
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      const response = await api.delete("/favorites", {
        data: { productId }, // axios way
      });
      const data = response.data;

      if (response.status === 200) {
        setFavorites((prev) =>
          prev.filter((item: { id: number }) => item.id !== productId)
        );
        toast.success(data.message || "Removed from favorites");
      } else {
        toast.error(data.message || "Problem removing from favorites");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing from favorites");
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorites,
        loading,
        errorMessage,
        fetchFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
