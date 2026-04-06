"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "./admin.css";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onLogin();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Link href="/" className="admin-login-back">
        <ArrowLeft size={16} />
        Back to Website
      </Link>
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <Lock size={32} />
        </div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-subtitle">Enter your password to continue</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="admin-login-input"
              autoFocus
              disabled={isLoading}
            />
            <button
              type="button"
              className="admin-login-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <span className="admin-login-spinner" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
