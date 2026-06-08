"use client"
import axios from "axios";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from "react-icons/ai";
import { TbPlayerTrackNext } from "react-icons/tb";




const EditRoleAndPhone = () => {

    const router = useRouter();

  const [role, setRole] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [adminExist, setAdminExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const roles = [
    { label: "Admin", value: "admin", icon: <AiOutlineTool size={40} /> },
    { label: "Vendor", value: "vendor", icon: <AiOutlineShop size={40} /> },
    { label: "User", value: "user", icon: <AiOutlineUser size={40} /> },
  ];

  // ✅ Check admin exist
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/admin/check-admin");
        setAdminExist(res.data.exists);
      } catch (error) {
        console.log(error);
        setAdminExist(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // validation
    if (!role || !phone) {
      setError("Please select role and enter phone number");
      return;
    }

    if (phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/user/edit-phone-role", {
        phone,
        role,
      });
    //   console.log(res)
      if (res.statusText=="OK") {
        // ✅ success redirect
        alert("update sucessful")
        router.push("/");
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <motion.div 
         initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: -40 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-10 border border-white/10"
        >
            <h1 className="text-center text-gray-300 mb-4 text-lg font-semibold">
          Choose Your Role
        </h1>

         <p className="text-center text-gray-400 mb-6 text-sm">
          Select your role and enter your mobile number
        </p>

         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Phone */}
          <input
            type="text"
            placeholder="Enter Mobile Number"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setPhone(value);
            }}
            className="bg-white/10 border border-white/30 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {roles.map((item) => {
              const isAdminBlocked =
                item.value === "admin" && adminExist;
              const isSelected = role === item.value;

              return (
                <motion.div
                  key={item.value}
                  whileHover={!isAdminBlocked ? { scale: 1.05 } : {}}
                  whileTap={!isAdminBlocked ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (!isAdminBlocked) setRole(item.value);
                  }}
                  className={`relative cursor-pointer rounded-2xl p-5 flex flex-col items-center border transition-all duration-300
                  
                  ${
                    isSelected
                      ? "bg-blue-500/20 border-blue-500"
                      : "bg-white/10 border-white/20"
                  }

                  ${
                    isAdminBlocked
                      ? "opacity-40 cursor-not-allowed bg-red-500/10 border-red-400"
                      : "hover:border-blue-400"
                  }
                `}
                >
                  <div className="mb-2">{item.icon}</div>
                  <h2 className="text-sm font-medium">{item.label}</h2>

                  {isSelected && (
                    <span className="absolute top-2 right-2 text-green-400">
                      ✓
                    </span>
                  )}

                  {isAdminBlocked && (
                    <span className="absolute bottom-2 text-xs text-red-400">
                      Already Taken
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Now"}
            {!loading && <TbPlayerTrackNext />}
          </motion.button>
        </form>


        </motion.div>

    </div>
  )
}

export default EditRoleAndPhone