import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Properly destructure data and error
      const { data, error } = await signup(email, password);

      if (error) {
        // Handle rate limit error specifically
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
        console.log("Signed up user:", data.user); // check the created user
        alert("Account created! Check your email for confirmation.");
        navigate("/login");
      } else {
        setError("Signup failed. Please try again.");
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
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

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
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
