
"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TbPlayerTrackNext } from "react-icons/tb";
import { signIn } from "next-auth/react";

  function Login (){
     const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Basic validation
  if (!email.trim() || !password.trim()) {
     setError("All fields are required");
    return;
  }

  try {
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // ⚡ important (manual control)
    });

    // ✅ Handle response
    if (result?.error) {
        console.log(result)
       setError("Invalid email or password");
      return;
    }

    if (result?.ok) {
  setTimeout(() => {
    router.push("/");
  }, 1000);
}
  } catch (error) {
    console.error("Login Error:", error);
    setError("Something went wrong. Try again.")
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-400">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Login to your MultiCart account
        </p>

        {/* show error  */}
        {error && (
  <p className="text-red-400 text-sm text-center">{error}</p>
)}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-gray-400"
              >
                {show ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <span className="text-sm text-blue-400 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full py-3 flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <TbPlayerTrackNext />}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Register redirect */}
          <p className="text-center text-gray-300 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </motion.div>
    </div>
    )
}
export default Login;
