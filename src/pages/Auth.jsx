import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(true); // Default to signup first
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await signup(email, password);

        if (error) {
          if (
            error.message.includes("rate limit") ||
            error.message.includes("too many requests")
          ) {
            setError(
              "Too many signup attempts. Please wait a few minutes before trying again."
            );
          } else {
            setError(error.message);
          }
        } else if (data?.user) {
          console.log("Signed up user:", data.user);
          alert("Account created! Check your email for confirmation.");
          navigate("/login"); // Or handle differently if needed
        } else {
          setError("Signup failed. Please try again.");
        }
      } else {
        const { error } = await login(email, password);

        if (error) {
          setError(error.message);
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="border p-2 w-full mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
            isSignup
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        <p className="text-sm mt-2 text-center">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}
