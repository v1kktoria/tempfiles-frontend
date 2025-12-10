import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchCurrentUser } from "../../store/slices/authSlice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, user, loading, dispatch]);

  const isAuthenticated = !!accessToken;
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    isAuthenticated,
    isAdmin,
    hasRole: (role: string) => user?.role === role,
  };
};
