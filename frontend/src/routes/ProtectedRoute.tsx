
import { Navigate, Outlet } from "react-router-dom";
import FullPageLoader from "@/components/FullPageLoader";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({allowedRoles}: ProtectedRouteProps) => {
  const {user, loading} = useAuth() ; 

  if(loading){
    return <FullPageLoader/>
  }

  if(!user){
    return <Navigate to="/" replace />
  }

  if(allowedRoles && !allowedRoles.includes(user.role)){
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet/>
};

export default ProtectedRoute ; 
