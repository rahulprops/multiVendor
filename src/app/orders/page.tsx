
"use client";
import UseGetAllOrdersData from "@/hooks/UseGetAllOrderData";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Orders = () => {
    UseGetAllOrdersData()
  const userData = useSelector((state: RootState) => state.user.userData);
  const allOrdersData = useSelector(
    (state: RootState) => state.user.allOrdersData,
  );
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackOrder, setTrackOrder] = useState<any | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter(
        (o) => String(o.buyer?._id) === String(userData?._id),
      )
    : [];

  const handleCancel = async (orderId: string) => {
    try {
      await axios.post("/api/order/cancelOrder", { orderId });
      const updateOrder = allOrdersData.map((o: any) =>
        o._id === orderId ? { ...o, orderStatus: "cancelled" } : o,
      );
      dispatch(setAllOrdersData(updateOrder));
      alert("order Cancelled");
      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
      alert("failed order cancelled");
    }
  };

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white text-xl">
        No Orders Found 🚫
      </div>
    );
  }

  const isEligibleReturn = (deliveryDate: string, replacementDay: number) => {
    if (!deliveryDate || !replacementDay) return false;
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDay * 24 * 60 * 60 * 1000;
    return Date.now() <= expiry;
  };
  const remainingDays = (deliveryDate: string, replacementDay: number) => {
    if (!deliveryDate || !replacementDay) return false;
    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDay * 24 * 60 * 60 * 1000;
    const diff = expiry - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const ReturnEndDate = (deliveryDate: string, replacementDay: number) => {
    if (!deliveryDate || !replacementDay) return false;
    const deliveredAt = new Date(deliveryDate);
    deliveredAt.setDate(deliveredAt.getDate() + replacementDay);

    return deliveredAt;
  };

  const returnOrder = async (orderId: string) => {
    try {
      const result = await axios.post("/api/order/return", { orderId });
      const updateOrder = allOrdersData.map((o: any) =>
        o._id === orderId
          ? {
              ...o,
              orderStatus: "returned",
              returnedAmount: result.data.returnedAmount,
            }
          : o,
      );
      dispatch(setAllOrdersData(updateOrder));
      alert("order returned");
      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
      alert(" order returned error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-400 text-sm">
              Track and manage your orders
            </p>
          </div>
          <div className="text-sm text-gray-300 bg-white/10 px-4 py-2 rounded-lg">
            {orders.length} Orders
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition duration-300"
            >
              {/* Top Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Order Info */}
                <div>
                  <h2 className="text-lg font-semibold">
                    Order ID: {order._id.slice(-6)}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      order.orderStatus === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.orderStatus === "delivered"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-4"></div>

              {/* Products */}
              <div className="grid gap-4">
                {order.products.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-white/5 p-3 rounded-xl"
                  >
                    <Image
                      src={item.product.image1}
                      width={120}
                      height={120}
                      alt="product"
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.title}</h3>
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>Delivery: ₹{order.deliveryCharge}</span>
                <span>Service: ₹{order.serviceCharge}</span>
              </div>
              {/* Vendor Details */}
              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  🏪 Vendor Details
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <div>
                    <p className="text-white font-medium">
                      ShopName: {"  "} {order.productVendor?.shopName}
                    </p>
                    <p className="text-gray-400">
                      Vendor Name: {order.productVendor?.name}
                    </p>
                  </div>

                  <div className="text-gray-400 text-sm">
                    {order.productVendor?.email}
                  </div>
                </div>
              </div>
              {/* Track Order Button */}
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                {/* Check Details Button */}
                {order.orderStatus !== "cancelled" && (
                  <button
                    className="px-5 py-2 rounded-lg font-medium text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    onClick={() => setSelectedOrder(order)}
                  >
                    🔍 Check Details
                  </button>
                )}
                {order.orderStatus === "returned" ? (
                  <button className=" mx-3 px-3 py-1 rounded-lg  font-medium bg-orange-600">
                    Returned <span>{order.returnedAmount}</span>
                  </button>
                ) : (
                  <>
                    {!["delivered", "shipped"].includes(order.orderStatus) ? (
                      <button
                        disabled={order.orderStatus === "cancelled"}
                        onClick={() => handleCancel(order._id)}
                        className={`px-5 py-2 rounded-lg font-medium text-sm bg-red-700 border border-white/20 text-white hover:bg-red-600 transition-all duration-300 ${order.orderStatus === "cancelled" ? "cursor-not-allowed" : ""}`}
                      >
                        {order.orderStatus === "cancelled"
                          ? "cancelled Order"
                          : "Cancel Order"}
                      </button>
                    ) : (
                      order.products.map((p: any, i: number) => {
                        const replacementDay = p.product.replacementDays || 0;
                        const eligible = isEligibleReturn(
                          order.deliveryDate,
                          replacementDay,
                        );
                        const remaining = remainingDays(
                          order.deliveryDate,
                          replacementDay,
                        );
                        const returnEndDate = ReturnEndDate(
                          order.deliveryDate,
                          replacementDay,
                        );

                        return (
                          <div
                            key={i}
                            className=" flex justify-between items-center  bg-white/5 px-3 py-2 rounded ml-2"
                          >
                            <div>
                              <p className=" text-xs text-gray-300">
                                {" "}
                                {p.product?.title}
                              </p>
                              {eligible ? (
                                <>
                                  <p className=" text-xs text-yellow-400">
                                    {remaining > 1 ? "s" : ""}
                                  </p>
                                  {returnEndDate && (
                                    <p className="text-xs text-gray-400">
                                      Return till:{" "}
                                      {returnEndDate.toLocaleDateString(
                                        "en-In",
                                      )}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className=" text-xs text-red-400">
                                  {" "}
                                  Return window closed
                                </p>
                              )}
                            </div>
                            {eligible && (
                              <button
                                onClick={() => returnOrder(order._id)}
                                className=" mx-3 px-3 py-1 bg-yellow-600"
                              >
                                Return
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Track Order Button */}
                    <button
                      disabled={order.orderStatus === "delivered"}
                      className={`relative px-5 py-2 rounded-lg font-medium text-sm text-white shadow-lg transition-all duration-300
    ${
      order.orderStatus === "delivered"
        ? "bg-green-500/20 text-green-400 cursor-not-allowed shadow-none"
        : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl"
    }
  `}
                      onClick={() => {
                        if (order.orderStatus !== "delivered") {
                          setTrackOrder(order);
                        }
                      }}
                    >
                      <span className="absolute inset-0 rounded-lg bg-white/10 blur opacity-0 hover:opacity-100 transition"></span>
                      🚚
                      {order.orderStatus === "delivered"
                        ? "✅ Delivered"
                        : "🚚 Track Order"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          {/* Modal Box */}
          <div className="w-full max-w-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">🧾 Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✖
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-gray-400">Order ID</p>
                <p className="font-medium">{selectedOrder._id}</p>
              </div>
              <div>
                <p className="text-gray-400">Date</p>
                <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div>
                <p className="text-gray-400">Payment</p>
                <p>{selectedOrder.paymentMethod.toUpperCase()}</p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">
                📍 Delivery Address
              </h3>
              <p className="font-medium">{selectedOrder.address?.name}</p>
              <p className="text-gray-400 text-sm">
                {selectedOrder.address?.phone}
              </p>
              <p className="text-gray-400 text-sm">
                {selectedOrder.address?.address}, {selectedOrder.address?.city}{" "}
                - {selectedOrder.address?.pincode}
              </p>
            </div>

            {/* Products */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-300">
                📦 Products
              </h3>
              <div className="grid gap-4">
                {selectedOrder.products.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-white/5 p-3 rounded-xl"
                  >
                    <Image
                      src={item.product.image1}
                      width={100}
                      height={100}
                      alt="product"
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor */}
            <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">
                🏪 Vendor
              </h3>
              <p className="font-medium">
                {selectedOrder.productVendor?.shopName}
              </p>
              <p className="text-gray-400 text-sm">
                {selectedOrder.productVendor?.name}
              </p>
              <p className="text-gray-400 text-sm">
                {selectedOrder.productVendor?.email}
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
              <h3 className="font-semibold mb-3 text-gray-300">
                💳 Price Details
              </h3>

              <div className="flex justify-between mb-1">
                <span>Products Total</span>
                <span>₹{selectedOrder.productsTotal}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Delivery</span>
                <span>₹{selectedOrder.deliveryCharge}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Service</span>
                <span>₹{selectedOrder.serviceCharge}</span>
              </div>

              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold text-green-400">
                <span>Total</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {trackOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          {/* Modal Box */}
          <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">🚚 Track Order</h2>
              <button
                onClick={() => setTrackOrder(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✖
              </button>
            </div>

            {/* Order Info */}
            <div className="mb-6 text-sm">
              <p className="text-gray-400">Order ID</p>
              <p className="font-medium">{trackOrder._id}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 mt-1 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-xs text-gray-400">
                    {new Date(trackOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Line */}
              <div className="ml-2 h-8 border-l border-white/20"></div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-4 h-4 mt-1 rounded-full ${
                    trackOrder.orderStatus !== "pending"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-xs text-gray-400">
                    Your order is being prepared
                  </p>
                </div>
              </div>

              <div className="ml-2 h-8 border-l border-white/20"></div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-4 h-4 mt-1 rounded-full ${
                    trackOrder.orderStatus === "shipped" ||
                    trackOrder.orderStatus === "delivered"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div>
                  <p className="font-medium">Shipped</p>
                  <p className="text-xs text-gray-400">Out for delivery 🚚</p>
                </div>
              </div>

              <div className="ml-2 h-8 border-l border-white/20"></div>

              {/* Step 4 */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-4 h-4 mt-1 rounded-full ${
                    trackOrder.orderStatus === "delivered"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div>
                  <p className="font-medium">Delivered</p>
                  <p className="text-xs text-gray-400">
                    Package delivered successfully
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
              <p className="text-gray-400">Delivery Address</p>
              <p className="font-medium">{trackOrder.address?.name}</p>
              <p className="text-gray-400">
                {trackOrder.address?.address}, {trackOrder.address?.city}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
