import { IUser } from '@/model/user.model';
import { AppDispatch, RootState } from '@/redux/store';
import { setAllVendorData } from '@/redux/vendorSlice';
import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const VendorApproval = () => {
  const dispatch = useDispatch<AppDispatch>();
  // UseGetAllVendors();
  // GetCurrentUser();
  const vendorData: IUser[] = useSelector(
    (state: RootState) => state.vendor.vendorData,
  );
  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [rejectModel, setRejectModel] = useState(false);
  const [rejectedReason, setRejectReason] = useState("");
  console.log(vendorData)
  const pendingVendors = Array.isArray(vendorData)
    ? vendorData.filter((v) => v.verificationStatus === "pending")
    : [];
  // console.log(pendingVendors)
  // approved function
  const handleApproved = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    try {
      await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status: "approved",
      });
      const updated = vendorData.filter((v) => v._id !== selectedVendor._id);
      dispatch(setAllVendorData(updated));
      setSelectedVendor(null);
      setLoading(false);
      alert("vendor approved");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("approval failed");
    }
  };

  // reject function
  const handleReject = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    try {
      await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status: "rejected",
        rejectedReason,
      });
      const updated = vendorData.filter((v) => v._id !== selectedVendor._id);
      dispatch(setAllVendorData(updated));
      setSelectedVendor(null);
      setLoading(false);
      alert("vendor rejected");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("rejected failed");
    }
  };

  const openRejectReasonArea = () => {
    setRejectModel(true);
    // setSelectedVendor(null);
    setRejectReason("");
  };
  return (
    <div className="  w-full px-3 sm:px-6 py-6 text-white">
      <h1 className=" text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
        {" "}
        Vendor Approval Requests
      </h1>
      {/* desktop table */}
      <div className=" hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className=" w-full text-left">
          <thead className=" bg-white/10">
            <tr>
              <th className=" p-4"> Vendor Name</th>
              <th className=" p-4"> Shop Name</th>
              <th className=" p-4"> Phone</th>
              <th className=" p-4"> Status</th>
              <th className=" p-4 text-center"> Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingVendors.length === 0 ? (
              <tr>
                <td className=" p-6 text-center text-gray-400">
                  No Vendor Approval requests found
                </td>
              </tr>
            ) : (
              pendingVendors.map((vendor, index) => (
                <tr
                  key={index}
                  className=" border-t border-white/10 hover:bg-white/5"
                >
                  <td className=" p-4">{vendor.name}</td>
                  <td className=" p-4">{vendor.shopName}</td>
                  <td className=" p-4">{vendor.phone || "_"}</td>
                  <td className=" p-4">
                    {" "}
                    <span className=" px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                      {vendor.verificationStatus}
                    </span>
                  </td>
                  <td className=" p-4 text-center">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className=" px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      Check Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* mobile card */}
      <div className=" md:hidden flex flex-col gap-4">
        {pendingVendors.length === 0 ? (
          <div className=" text-center text-gray-400 mt-10">
            No Vendor Approval requests found
          </div>
        ) : (
          pendingVendors.map((vendor, index) => (
            <div
              key={index}
              className=" bg-white/10 border border-white/20 rounded-xl p-4 space-y-2"
            >
              <div className=" flex justify-between items-center">
                <h3 className=" font-semibold capitalize text-lg">
                  {vendor.name}
                </h3>
                <span className=" px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                  {vendor.verificationStatus}
                </span>
              </div>
              <p className=" text-sm text-gray-300">
                <b>Shop:</b>
                {vendor.shopName}
              </p>
              <p className=" text-sm text-gray-300">
                <b>Phone:</b>
                {vendor.phone}
              </p>
              <button
                className=" w-full mt-3 bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded-lg"
                onClick={() => setSelectedVendor(vendor)}
              >
                Check Details
              </button>
            </div>
          ))
        )}
      </div>
      <AnimatePresence>
        {selectedVendor  && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className=" bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10"
            >
              <h3 className=" text-xl sm:text-2xl font-bold mb-4">
                {" "}
                Selected Vendor Details
              </h3>
              <div className=" space-y-2 text-sm mt-3 ">
                <p>
                  <b>Name:</b> {selectedVendor.name}
                </p>
                <p>
                  <b>Email:</b> {selectedVendor.email}
                </p>
                <p>
                  <b>Phone:</b> {selectedVendor.phone}
                </p>
                <p>
                  <b>ShopName:</b> {selectedVendor.shopName}
                </p>
                <p>
                  <b>ShopAddress:</b> {selectedVendor.shopAddress}
                </p>
                <p>
                  <b>GSTIN:</b> {selectedVendor.gstNumber}
                </p>
              </div>
              <div className=" flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  disabled={loading}
                  className=" flex-1 bg-green-600 hover:bg-green-600 py-2 rounded-lg text-sm"
                  onClick={handleApproved}
                >
                  {loading ? "Loading" : "Approve"}
                </button>
                <button
                  className=" flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
                  onClick={openRejectReasonArea}
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className=" flex-1 bg-gray-700 hover:bg-gray-800 py-2 rounded-lg text-sm "
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className=" bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10"
            >
              <h3 className=" text-xl sm:text-2xl font-bold mb-4">
                {" "}
                Enter Reject Reason
              </h3>

              <textarea
                placeholder="Enter rejection reason..."
                className=" w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm "
                rows={3}
                onChange={(e) => setRejectReason(e.target.value)}
                value={rejectedReason}
              />

              <div className=" flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
                  onClick={() => {
                    handleReject(); // ✅ call function
                    setRejectModel(false);
                  }}
                >
                  {loading ? "processing..." : "Confirm Reject"}
                </button>
                <button
                  onClick={() => setRejectModel(false)}
                  className=" flex-1 bg-gray-700 hover:bg-gray-800 py-2 rounded-lg text-sm "
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VendorApproval