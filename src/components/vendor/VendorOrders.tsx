"use client";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VendorOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [otpModel, setOtpModel] = useState<any | null>(null);
  const [otp, setOtp] = useState("");

  const userData = useSelector((state: RootState) => state.user.userData);
  const allOrdersData = useSelector(
    (state: RootState) => state.user.allOrdersData,
  );

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter(
        (o) => String(o.productVendor?._id) === String(userData?._id),
      )
    : [];

  const statusOptions = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    
  ];

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const result = await axios.post("/api/order/update-status", {
        orderId,
        status,
      });
      dispatch(
        setAllOrdersData(
          allOrdersData.map((o: any) =>
            o._id === orderId ? { ...o, orderStatus: status } : o,
          ),
        ),
      );
      alert("OrderStatus updated");
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("/api/order/verify-delivery-otp", {
        orderId: otpModel._id,
        otp: otp,
      });
      dispatch(
        setAllOrdersData(
          allOrdersData.map((o: any) =>
            o._id === otpModel._id ? { ...o, orderStatus: "delivered" } : o,
          ),
        ),
      );

      alert("Order Delivered sucessfully");
      setOtpModel(null);
      setOtp("");
    } catch (error) {
      console.log(error);
      alert("Order Delivery error");
    }
  };
  return (
    <div className="w-full px-3 sm:px-6 py-6 text-white">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        📦 Vendor Orders
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr
                  key={order._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    {order.buyer?.name}
                    <p className="text-xs text-gray-400">
                      {order.buyer?.email}
                    </p>
                  </td>

                  <td className="p-4">{order.products[0]?.product?.title}</td>

                  <td className="p-4 text-green-400 font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentMethod === "cod"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Stripe"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {order.orderStatus === "delivered" && (
                      <span className="text-green-400 font-semibold">
                        Delivered
                      </span>
                    )}

                    {/* {order.orderStatus === "cancelled" && (
                      <span className="text-red-400 font-semibold">
                        Cancelled
                      </span>
                    )} */}

                    {order.orderStatus === "returned" && (
                      <span className="text-purple-400 font-semibold">
                        Returned
                      </span>
                    )}

                    {order.OrderStatus === "returned" && (
                      <span className=" text-green-400 font-semibold capitalize">
                        {" "}
                        Returned{" "}
                      </span>
                    )}

                    {order.orderStatus !== "delivered" &&
                      order.orderStatus !== "cancelled" &&
                      order.orderStatus !== "returned" && (
                        <div className="flex items-center justify-center gap-2">
                          {/* Styled Select */}
                          <select
                            value={order.orderStatus}
                            onChange={async (e) => {
                              if (e.target.value === "delivered") {
                                updateStatus(String(order._id), "delivered");
                                setOtpModel(order);
                              } else {
                                updateStatus(String(order._id), e.target.value);
                              }
                            }}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {statusOptions.map((s, i) => (
                              <option
                                key={i}
                                value={s}
                                className=" text-gray-800"
                              >
                                {s.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No Orders Found</div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  {order.products[0]?.product?.title}
                </h3>

                <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
                  {order.orderStatus}
                </span>
              </div>

              <p className="text-sm text-gray-300">
                <b>Customer:</b> {order.buyer?.name}
              </p>

              <p className="text-sm text-gray-300">
                <b>Total:</b> ₹{order.totalAmount}
              </p>

              <p className="text-sm text-gray-300">
                <b>Payment:</b>{" "}
                <span
                  className={`ml-1 px-2 py-1 rounded text-xs ${
                    order.paymentMethod === "cod"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {order.paymentMethod === "cod" ? "COD" : "Stripe"}
                </span>
              </p>

              <div className="flex gap-2 mt-3">
                <select
                  value={order.orderStatus}
                  onChange={async (e) => {
                    if (e.target.value === "delivered") {
                      updateStatus(String(order._id), "delivered");
                      setOtpModel(order);
                    } else {
                      updateStatus(String(order._id), e.target.value);
                    }
                  }}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm"
                >
                  {statusOptions.map((s, i) => (
                    <option key={i} value={s} className=" text-gray-700">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
      {otpModel && (
        <div className=" fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className=" bg-[#061526] p-6 rounded-xl w-full max-w-md ">
            <h2 className=" text-lg font-semibold mb-3">Enter Delivery Otp</h2>
            <input
              type="text"
              className=" w-full bg-white/10 border border-white/20 px-4 py-2 rounded mb-4"
              placeholder="Enter Otp"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
            <button
              onClick={verifyOtp}
              className=" w-full bg-green-600 py-2 rounded flex items-center justify-center gap-2 "
            >
              Verify & Deliver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
