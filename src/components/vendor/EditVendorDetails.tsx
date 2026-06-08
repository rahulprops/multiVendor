"use client";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { AiOutlineFileText, AiOutlineHome, AiOutlineShop } from "react-icons/ai";
import { TbPlayerTrackNext } from "react-icons/tb";
import { useRouter } from "next/navigation";

const EditVendorDetails = () => {
  const router = useRouter();

  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

//   ✅ GST simple validation
  const validateGST = (gst: string) => {
    const gstRegex = /^[0-9A-Z]{15}$/;
    return gstRegex.test(gst);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!shopName || !shopAddress || !gstNumber) {
      return setError("⚠️ All fields are required");
    }

    if (!validateGST(gstNumber)) {
      return setError("⚠️ Invalid GST Number (must be 15 characters)");
    }

    try {
      setLoading(true);

      const result = await axios.post("/api/vendor/editDetails", {
        shopName,
        shopAddress,
        gstNumber,
      });
        // console.log(result)
      if (result.statusText=="OK") {
        setSuccess("✅ Vendor details updated successfully!");

        // 🔥 redirect after 1.5s
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(result?.data?.message || "Something went wrong");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10"
        >
          <h3 className="text-3xl font-semibold text-center mb-4">
            Complete Your Shop Details
          </h3>

          <p className="text-center text-gray-300 mb-6 text-sm">
            Enter your information to activate your vendor account.
          </p>

          {/* 🔴 Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* 🟢 Success */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-green-400 text-sm text-center"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Shop Name */}
            <div className="relative">
              <AiOutlineShop className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Shop Name"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="relative">
              <AiOutlineHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Shop Address"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
              />
            </div>

            {/* GST */}
            <div className="relative">
              <AiOutlineFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="GSTIN"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
              ) : (
                <>
                  Submit Now <TbPlayerTrackNext />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EditVendorDetails;