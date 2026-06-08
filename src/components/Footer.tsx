"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { motion } from 'motion/react'
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
} from 'react-icons/ai'
import { IUser } from '@/model/user.model';

const Footer = ({ user }: { user: IUser }) => {
  const router = useRouter()

  const role = user?.role
  const isUser = role === "user"
  const isAdminOrVendor = role === "admin" || role === "vendor"

  return (
    <footer className="relative bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-[#000] text-gray-300 border-t border-gray-800">

      {/* 🔥 Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 blur-2xl opacity-30" />

      <div className={`relative max-w-7xl mx-auto px-6 py-14 grid gap-10 
        ${isUser ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}
      `}>

        {/* 🌟 Brand */}
        <motion.div whileHover={{ scale: 1.05 }} className="space-y-4">
          <h2 className="text-white text-3xl font-bold tracking-wide cursor-pointer hover:text-blue-400 transition">
            MultiCart
          </h2>

          <p className="text-sm text-gray-400 leading-relaxed">
            Smart, secure & scalable multi-vendor eCommerce platform built for performance and growth.
          </p>

          {isAdminOrVendor && (
            <span className={`inline-block text-xs px-3 py-1 rounded-full text-white 
              ${role === "admin" ? "bg-blue-600" : "bg-green-600"}`}>
              {role === "admin" ? "Admin Panel" : "Vendor Panel"}
            </span>
          )}

          {/* 🌐 Social Icons */}
          <div className="flex gap-4 pt-2">
            {[AiFillFacebook, AiFillInstagram, AiFillTwitterCircle].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, y: -2 }}
                className="cursor-pointer text-2xl hover:text-blue-400 transition"
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🔗 Quick Links */}
        {isUser && (
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Categories", path: "/category" },
                { label: "Shop", path: "/shop" },
                { label: "Orders", path: "/orders" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  className="cursor-pointer hover:text-white transition"
                  onClick={() => router.push(item.path)}
                >
                  {item.label}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* 🆘 Support */}
        {isUser && (
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Support", path: "/support" },
                { label: "Track Orders", path: "/orders" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  className="cursor-pointer hover:text-white transition"
                  onClick={() => router.push(item.path)}
                >
                  {item.label}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* 🛠 Admin / Vendor Panel */}
        {isAdminOrVendor && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg"
          >
            <h2 className="text-white text-lg font-semibold mb-3">
              {role === "admin" ? "System Access" : "Vendor Tools"}
            </h2>

            <ul className="space-y-2 text-sm text-gray-400">
              {role === "admin" ? (
                <>
                  <li>✔ Platform Management</li>
                  <li>✔ Vendor Control</li>
                  <li>✔ Orders & Revenue</li>
                  <li>✔ System Security</li>
                </>
              ) : (
                <>
                  <li>✔ Product Management</li>
                  <li>✔ Order Tracking</li>
                  <li>✔ Sales Analytics</li>
                  <li>✔ Wallet & Payouts</li>
                </>
              )}
            </ul>
          </motion.div>
        )}

        {/* 📞 Contact */}
        <div className="space-y-3">
          <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>

          <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 text-sm">
            <AiOutlineMail /> admin@multicart.com
          </motion.div>

          <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 text-sm">
            <AiOutlinePhone /> +91 98745 56256
          </motion.div>

          <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 text-sm">
            <AiOutlineEnvironment /> New Delhi, India
          </motion.div>
        </div>
      </div>

      {/* 🔻 Bottom Bar */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-800 py-4">
        © {new Date().getFullYear()} MultiCart — Built with ❤️ for scalable commerce
      </div>
    </footer>
  )
}

export default Footer