import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../shared/hooks/hooks";
import { loginSuccess, fetchCurrentUser } from "../../store/slices/authSlice";
import { toast } from "react-hot-toast";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get("accessToken");
    if (token) {
      dispatch(loginSuccess(token));
      dispatch(fetchCurrentUser())
        .unwrap()
        .then(() => {
          toast.success("Successfully logged in");
          navigate("/files");
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      toast.error("No access token received");
      navigate("/login");
    }
  }, [dispatch, navigate, searchParams]);

  return <div>Загрузка...</div>;
};

export default OAuthCallback;
