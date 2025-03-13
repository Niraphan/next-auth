"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false, // Handle redirect manually
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/profile");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        setError(`Failed to sign in with ${provider}: ${result.error}`);
      } else {
        router.push("/profile");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded mb-4 disabled:bg-blue-300"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded mb-4 disabled:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            width="20"
            height="20"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          {loading ? "Processing..." : "Sign in with Google"}
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn("facebook")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded disabled:text-gray-400"
        >
          <FacebookIcon />
          {loading ? "Processing..." : "Sign in with Facebook"}
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn("line")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded disabled:text-gray-400"
        >
          {loading ? "Processing..." : "Sign in with Line"}
        </button>
      </form>
    </div>
  );
}