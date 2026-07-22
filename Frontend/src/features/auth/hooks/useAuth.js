import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../../store/slices/authSlice.js";

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  const handleLogin = async (username, password) => {
    await dispatch(loginUser({ username, password })).unwrap()
  }

  const handleRegister = async (username, email, password) => {
    await dispatch(registerUser({ username, email, password })).unwrap()
  }

  return {
    user, loading, error, handleLogin, handleRegister
  }
} 