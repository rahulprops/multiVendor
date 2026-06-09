"use client";

import UseGetAllProducts from "@/hooks/UseGetAllProductData";
import { IProduct } from "@/model/product.model";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllProducts } from "@/redux/vendorSlice";
import axios from "axios";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const VendorProducts = () => {
  const router = useRouter();
  UseGetAllProducts()
  const dispatch= useDispatch<AppDispatch>()
 
  const currentUser = useSelector(
    (state: RootState) => state.user.userData
  );

  const allProductData: IProduct[] = useSelector(
    (state: RootState) => state.vendor.allProducts
  );
 
   console.log(allProductData)
  // ✅ FIXED FILTER
  const myProducts =
    currentUser?._id && Array.isArray(allProductData)
      ? allProductData.filter(
          (p) =>
            p.vendor === currentUser._id ||
            p.vendor?._id === currentUser._id
        )
      : [];
//  console.log(myProducts)
  const toggleIsActive = async (productId:string,currentisActive)=>{
    try {
        const result = await axios.post("/api/vendor/isActiveProduct",{ productId,isActive:!currentisActive})
       
         const updatedProduct= allProductData.map((p:any)=>p._id===productId ? result.data : p)
         dispatch(setAllProducts(updatedProduct))
     } catch (error) {
      console.log(error)
      alert("update error")
    }
  }
  return (
    <div className="w-full p-4 sm:p-8 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          My Products
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold text-sm sm:text-base shadow-lg"
          onClick={() => router.push("/addVendorProduct")}
        >
          + Add Product
        </motion.button>
      </div>

      {/* EMPTY STATE */}
      {myProducts.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-2">
            Start by adding your first product 🚀
          </p>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {myProducts.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Active</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {myProducts.map((product) => (
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

                  <td className="p-4 font-semibold text-green-400">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        product.verificationStatus === "approved"
                          ? "bg-green-500/30 text-green-300"
                          : product.verificationStatus === "pending"
                          ? "bg-yellow-500/30 text-yellow-300"
                          : "bg-red-500/30 text-red-300"
                      }`}
                    >
                      {product.verificationStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.isActive
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className=" p-4 text-center flex flex-col space-y-1">
                 <button className=" px-3 py-1 rounded text-sm bg-purple-600 hover:bg-purple-700" onClick={()=>router.push(`/updateProduct/${product._id}`)}>Edit</button>
                 <motion.button whileHover={{scale:1.02}} whileTap={{ scale:0.97}}
                  className={` px-3 py-1 rounded text-sm ${
                    product.verificationStatus === "approved" ? " bg-green-600 hover:bg-green-700" : "bg-gray-600  cursor-not-allowed"
                    }`}
                    disabled={product.verificationStatus !== "approved"}
                    onClick={()=>toggleIsActive(
                      String(product._id),Boolean(product.isActive))}
                 >
                   {product.isActive ? "Disable" : "Enable"}
                 </motion.button>

                 {product.verificationStatus === "rejected" && <div className=" mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded">
                   <p><b>Rejected:</b>{" "} {product.rejectedReason || " No reason provied"}</p>
                   <p className=" mt-1 text-yellow-300"> After edit, product will be sent for re-verification</p>
                  </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📱 MOBILE CARD UI */}
      <div className="md:hidden flex flex-col gap-4">
        {myProducts.map((product) => (
          <motion.div
            key={product._id?.toString()}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 border border-white/20 rounded-xl p-4 flex gap-4 items-center"
          >
            <Image
              src={product.image1}
              alt="product"
              width={70}
              height={70}
              className="rounded object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                {product.title}
              </h3>

              <p className="text-green-400 text-sm font-medium">
                ₹{product.price}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs px-2 py-1 rounded bg-yellow-500/30">
                  {product.verificationStatus}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    product.isActive
                      ? "bg-green-600"
                      : "bg-gray-600"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorProducts;