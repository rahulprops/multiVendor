"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbPlayerTrackNext } from "react-icons/tb";
function Register (){
    const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // ✅ Success UX
      alert(data.message || "Account created successfully");

      // 👉 optional: auto redirect
      router.push("/login");

      // 👉 optional: reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.log(error);

      // ✅ Better error handling
      const message = error?.response?.data?.message || "Something went wrong";

      alert(message);
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence mode="wait">
        {/* for setp1 ui  */}
        {step == 1 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className=" w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20"
          >
            <h1 className=" text-4xl font-bold mb-4 text-blue-400">
              Welcome to MultiCart
            </h1>
            <p className=" text-gray-300 mb-6">
              {" "}
              Register with one of the following account type:
            </p>
            <div className=" grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "User", icon: "👤", value: "user" },
                { label: "Vendor", icon: "🏬", value: "vendor" },
                { label: "Admin", icon: "🙍‍♂️", value: "admin" },
              ].map((item) => (
                <motion.div
                  key={item.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className=" p-4 bg-white/5 hover:bg-white/20 cursor-pointer rounded-xl border border-white/30 shadow-lg flex flex-col items-center transition"
                >
                  <span className="text-3xl mb-2">{item.icon}</span>
                  <span className="capitalize">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setStep(2)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 justify-center mx-auto"
            >
              next <TbPlayerTrackNext />
            </motion.button>
          </motion.div>
        )}
        {/* for setp2 ui  */}
        {step == 2 && (
          <motion.div
            className=" w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className=" text-2xl font-semibold text-center mb-6  text-blue-300">
              Create your Account
            </h1>
            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Register Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Register Now"}
                {!loading && <TbPlayerTrackNext />}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Login Redirect */}
              <p className="text-center text-gray-300 text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    )
}

export default Register;