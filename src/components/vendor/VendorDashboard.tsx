"use client";
import { AnimatePresence, motion } from "motion/react";

import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import VendorHome from "./Dashboard";
import VendorProducts from "./VendorProducts";
import VendorOrders from "./VendorOrders";

const VendorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <VendorHome />;
      case "products":
        return <VendorProducts />;
      case "orders":
        return <VendorOrders />;

      default:
        return <VendorHome />;
    }
  };

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "products", label: "Products", icon: <FaBoxOpen size={22} /> },
    { id: "orders", label: "User Orders", icon: <FaShoppingCart size={22} /> },
  ];
  return (
    <div className=" w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex overflow-hidden">
      {/* Mobile Tab bar */}
      {!openMenu && (
        <>
          <div className=" lg:hidden fixed top-16 left-0 w-full bg-black px-6 py-3 flex justify-between items-center border-b border-gray-700 z-50">
            <h1 className=" text-xl font-bold">Admin Panel</h1>
            <button onClick={() => setOpenMenu(true)}>
              <AiOutlineMenu size={24} />
            </button>
          </div>
        </>
      )}

      {/* sidebar for large Area */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=" hidden  pt-20 lg:block min-h-screen w-72 bg-gray-800/40 border-r border-gray-700 p-6 backdrop-blur-xl"
      >
        <h1 className=" text-xl font-bold mb-6">Admin Panel</h1>
        <div className=" flex flex-col gap-3">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${activePage == item.id ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"}`}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* sidebar for mobile */}

      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className=" lg:hidden fixed top-0 left-0 w-72 h-full bg-gray-800/90 backdrop-blur-xl p-6 z-50 border-r border-gray-700 "
          >
            <div className=" flex justify-between items-center mb-6">
              <h1 className=" text-xl font-bold">Admin Panel</h1>
              <button onClick={() => setOpenMenu(false)}>
                {" "}
                <AiOutlineClose size={26} />
              </button>
            </div>
            <div className=" flex flex-col gap-3">
              {menu.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${activePage == item.id ? "bg-blue-600 text-white" : "bg-black/20 hover:bg-gray-700"}`}
                  onClick={() => {
                    setOpenMenu(false);
                    setActivePage(item.id);
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main area */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className=" flex-1 p-6 lg:p-10 mt-16 lg:mt-0 overflow-y-auto scrollbar-hide h-screen"
      >
        {renderPage()}
      </motion.div>
    </div>
  );
};

export default VendorDashboard;
