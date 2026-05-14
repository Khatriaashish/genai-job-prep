import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React, { ReactNode } from "react";

const Protected = ({ children }: { children: ReactNode }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" aria-label="Loading" />
        <p>Loading your workspace...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children as any;
};

export default Protected;
