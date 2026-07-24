import { useDispatch, useSelector } from "react-redux";
import {
  login as loginThunk,
  logout as logoutThunk,
  register as registerThunk
} from "../features/auth/authSlice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    isAdmin: auth.user?.role === "admin",
    isHR: auth.user?.role === "hr",
    login: (payload) => dispatch(loginThunk(payload)).unwrap(),
    register: (payload) => dispatch(registerThunk(payload)).unwrap(),
    logout: () => dispatch(logoutThunk()).unwrap()
  };
};

export default useAuth;
