import { useState } from "react";

import LoginView from "./LoginView.jsx";

/**
 * @typedef {Object} LoginPageProps
 * @property {(email: string) => void} onLogin
 */

/** @param {LoginPageProps} props */
export default function LoginPage({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggleShowPassword = () => setShowPassword((v) => !v);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email && onLogin) onLogin(loginForm.email);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      registerForm.email &&
      registerForm.password === registerForm.confirmPassword
    ) {
      if (onLogin) onLogin(registerForm.email);
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
    />
  );
}
