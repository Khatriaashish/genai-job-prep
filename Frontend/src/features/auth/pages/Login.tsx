import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, error, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await handleLogin({ email, password });
    if (user) navigate("/");
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" aria-label="Loading" />
        <p>Checking your account...</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="form-container">
        <div className="auth-heading">
          <p className="section-kicker">Interview Prep</p>
          <h1>Log in</h1>
          <p>Open your saved interview plans and resume drafts.</p>
        </div>
        {error && <div className="alert alert--error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to={"/register"}>Register</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Login;
