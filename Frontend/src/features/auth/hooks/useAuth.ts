import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { getApiErrorMessage } from "../../../utils/apiError";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Check your email and password."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Logout failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return { user, loading, error, handleRegister, handleLogin, handleLogout };
};
