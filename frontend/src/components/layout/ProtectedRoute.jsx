import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = JSON.parse(sessionStorage.getItem("usuario"));
  const userRole = storedUser?.rol;
  console.log(storedUser); 

  console.log("Allowed Roles: ", storedUser.rol);
  const isAuthenticated = !!storedUser;
  const isAuthorized = allowedRoles ? allowedRoles.includes(userRole) : true;
  console.log("Is Authenticated: ", isAuthenticated);
  console.log("Is Authorized: ", isAuthorized);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;