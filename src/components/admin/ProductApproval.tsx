"use client";

import GetCurrentUser from "@/hooks/GetCurrentUser";
import UseGetAllProducts from "@/hooks/UseGetAllProductData";
import { IProduct } from "@/model/product.model";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllProducts } from "@/redux/vendorSlice";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductApproval = () => {
  UseGetAllProducts();
  const dispatch = useDispatch<AppDispatch>();

  
  // GetCurrentUser();

//   useEffect(() => {
//   UseGetAllProducts();
// }, []);
  const allProductData: IProduct[] = useSelector(
    (state: RootState) => state.vendor.allProducts
  );
  console.log(allProductData)

  const [selectedProduct, setSelectedProduct] =
    useState<IProduct | null>(null);

  const [loading, setLoading] = useState(false);
  const [rejectModel, setRejectModel] = useState(false);
  const [rejectedReason, setRejectReason] = useState("");

  // ✅ FILTER
  const pendingProducts = Array.isArray(allProductData)
    ? allProductData.filter(
        (p) => p.verificationStatus === "pending"
      )
    : [];

  // ✅ APPROVE
  const handleApproved = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: selectedProduct._id,
        status: "approved",
      });

      const updated = allProductData.filter(
        (p) => p._id !== selectedProduct._id
      );

      dispatch(setAllProducts(updated));

      setSelectedProduct(null);
      alert("Product Approved ✅");
    } catch (error) {
      console.log(error);
      alert("Approval Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❌ REJECT
  const handleReject = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: selectedProduct._id,
        status: "rejected",
        rejectedReason,
      });

      const updated = allProductData.filter(
        (p) => p._id !== selectedProduct._id
      );

      dispatch(setAllProducts(updated));

      setSelectedProduct(null);
      setRejectModel(false)
      setRejectReason("")
      alert("Product Rejected ❌");
    } catch (error) {
      console.log(error);
      alert("Reject Failed");
    } finally {
      setLoading(false);
    }
  };

  const openRejectReasonArea = () => {
    setRejectModel(true);
    setRejectReason("");
  };

  return (
    <div className="w-full px-3 sm:px-6 py-6 text-white">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Product Approval Requests
      </h1>

      {/* EMPTY STATE */}
      {pendingProducts.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No Product Approval requests found
        </div>
      )}

      {/* DESKTOP TABLE */}
      {pendingProducts.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4">status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingProducts.map((product) => (
                <tr
                  key={product._id?.toString()}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    <Image
                      src={product.image1}
                      alt="product"
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                  </td>

                  <td className="p-4">{product.title}</td>

                  <td className="p-4 text-green-400">
                    ₹{product.price}
                  </td>

                  <td className="p-4">{product.category}</td>
                    
                    <td className=" p-4"> 
                      <span className=" px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300"> {product.verificationStatus}</span>
                    </td>

                  <td className="p-4">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      Check Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📱 MOBILE UI */}
      <div className="md:hidden flex flex-col gap-4">
        {pendingProducts.map((product) => (
          <div
            key={product._id?.toString()}
            className="bg-white/10 border border-white/20 rounded-xl p-4 flex gap-4"
          >
            <Image
              src={product.image1}
              alt="product"
              width={70}
              height={70}
              className="rounded object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-green-400">₹{product.price}</p>

              <button
                className="mt-3 w-full bg-blue-600 py-2 rounded-lg"
                onClick={() => setSelectedProduct(product)}
              >
                Check Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 MODAL */}
      <AnimatePresence>
        {selectedProduct && !rejectModel  && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">
                Product Details
              </h3>

              <Image
                src={selectedProduct.image1}
                alt="product"
                width={300}
                height={200}
                className="rounded mb-4"
              />

              <p><b>Title:</b> {selectedProduct.title}</p>
              <p><b>Price:</b> ₹{selectedProduct.price}</p>
              <p><b>Category:</b> {selectedProduct.category}</p>
              <p><b>Description:</b> {selectedProduct.description}</p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApproved}
                  className="flex-1 bg-green-600 py-2 rounded-lg"
                >
                  {loading ? "loading..." :"Approve"}
                </button>

                <button
                  onClick={openRejectReasonArea}
                  className="flex-1 bg-red-600 py-2 rounded-lg"
                >
                  Reject
                </button>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-gray-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ REJECT MODAL */}
      <AnimatePresence>
        {rejectModel && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <motion.div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
              <textarea
                placeholder="Enter reason..."
                className="w-full p-3 bg-white/10 rounded"
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 py-2 rounded"
                >
                  {loading ? "loading..." :"Confirm"}
                </button>

                <button
                  onClick={() => {setRejectModel(false);setSelectedProduct(null)}}
                  className="flex-1 bg-gray-600 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductApproval;