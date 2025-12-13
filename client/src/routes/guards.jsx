import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
};

export const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin")
    return <Navigate to="/login" />;
  return children;
};
