import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { isAuthenticated } from "./isAuth";

export const Protected = () => {
  const faceId = isAuthenticated();
  const location = useLocation();
  return (
    <>
      {faceId && faceId?.facialId ? (
        <Outlet />
      ) : (
        <Navigate
          to="/login"
          redirect="/login"
          replace
          state={{ from: location }}
        />
      )}
    </>
  );
};
