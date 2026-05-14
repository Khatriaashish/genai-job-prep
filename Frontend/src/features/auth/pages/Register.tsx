import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, handleRegister } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await handleRegister({ username, email, password });
    if (user) navigate("/");
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" aria-label="Loading" />
        <p>Creating your account...</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="form-container">
        <div className="auth-heading">
          <p className="section-kicker">Interview Preparation</p>
          <h1>Create account</h1>
          <p>Save generated interview plans and tailored resume PDFs.</p>
        </div>
        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
            />
          </div>
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

          <button className="button primary-button">Register</button>
        </form>

        <p>
          Already have an account? <Link to={"/login"}>Login</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Register;
