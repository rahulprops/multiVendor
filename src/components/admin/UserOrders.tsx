"use client";
import UseGetAllOrdersData from "@/hooks/UseGetAllOrderData";
// import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import { RootState } from "@/redux/store";

import { useSelector } from "react-redux";

const UserOrders = () => {
  UseGetAllOrdersData()

  const allOrdersData = useSelector(
    (state: RootState) => state.user.allOrdersData,
  );

  return (
    <div className="w-full px-3 sm:px-6 py-6 text-white">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        📦 All Orders
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Order Id</th>
              <th className="p-4">Buyer</th>
              <th className="p-4">vendor</th>
              <th className="p-4">Product</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {allOrdersData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No Orders Found
                </td>
              </tr>
            ) : (
              allOrdersData.map((order: any) => (
                <tr
                  key={order._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{order._id.slice(0, 8)}...</td>

                  <td className="p-4">
                    {order.buyer?.name}
                    <p className="text-xs text-gray-400">
                      {order.buyer?.email}
                    </p>
                  </td>
                  <td className="p-4">
                    {order.productVendor.shopName || "N/A"}
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
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))  
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {allOrdersData.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No Orders Found</div>
        ) : (
          allOrdersData.map((order: any) => (
            <div
              key={order._id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-3"
            >
              {/* Top */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-base">
                  {order.products?.[0]?.product?.title}
                </h3>

                <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
                  {order.orderStatus}
                </span>
              </div>

              {/* Order ID */}
              <p className="text-xs text-gray-400">
                Order ID: {order._id.slice(0, 8)}...
              </p>

              {/* Buyer */}
              <div className="text-sm text-gray-300">
                <p>
                  <b>Customer:</b> {order.buyer?.name}
                </p>
                <p className="text-xs text-gray-400">{order.buyer?.email}</p>
              </div>

              {/* Vendor */}
              <p className="text-sm text-gray-300">
                <b>Vendor:</b> {order.productVendor.shopName|| "N/A"}
              </p>

              {/* Amount + Payment */}
              <div className="flex justify-between items-center">
                <p className="text-green-400 font-semibold">
                  ₹{order.totalAmount}
                </p>

                <span
                  className={`px-2 py-1 rounded text-xs ${
                    order.paymentMethod === "cod"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {order.paymentMethod === "cod" ? "COD" : "Stripe"}
                </span>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 text-right">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
