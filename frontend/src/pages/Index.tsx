import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Login from "./Login";
import FullPageLoader from "@/components/FullPageLoader";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Login />;
};

export default Index;
