import { AuthContext } from "@/contexts/AuthContext";
import { useContext, type PropsWithChildren } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center flex-col gap-3 bg-white rounded-lg shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
