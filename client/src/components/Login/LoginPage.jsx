import { useState } from "react";

import LoginView from "./LoginView.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

/** @typedef {import("../../assets/types/pagesProps/LoginPageProps").LoginPageProps} LoginPageProps */

/** @param {LoginPageProps} props */
export default function LoginPage({ onLogin }) {
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleShowPassword = () => setShowPassword((v) => !v);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(loginForm.email, loginForm.password);
      if (onLogin) onLogin(data.user);
    } catch (err) {
      console.error('[LoginPage] Login failed:', err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const data = await register(registerForm.email, registerForm.name, registerForm.password);
      if (onLogin) onLogin(data.user);
    } catch (err) {
      console.error('[LoginPage] Register failed:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: "Film",
      title: "Discover Movies",
      description: "Explore thousands of movies across all genres",
    },
    {
      icon: "Star",
      title: "Rate & Review",
      description: "Share your thoughts and see what others think",
    },
    {
      icon: "Bookmark",
      title: "Personal Watchlist",
      description: "Save movies to watch later and track your favorites",
    },
    {
      icon: "Users",
      title: "Community",
      description: "Connect with fellow movie enthusiasts",
    },
  ];

  return (
    <LoginView
      showPassword={showPassword}
      onToggleShowPassword={handleToggleShowPassword}
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      registerForm={registerForm}
      setRegisterForm={setRegisterForm}
      onLoginSubmit={handleLogin}
      onRegisterSubmit={handleRegister}
      features={features}
      onLogin={onLogin}
      error={error}
      isLoading={isLoading}
    />
  );
}
