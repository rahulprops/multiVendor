'use client'
import { IUser } from '@/model/user.model';
import React, { useState } from 'react'
import VendorDashboard from './VendorDashboard';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const VendorPage = ({user}:{user : IUser}) => {
    console.log(user)
    const [openVerifyForm,setOpenVerifyForm]=useState(false)
    const [shopName,setShopName]=useState(user.shopName || "")
    const [shopAddress,setShopAddress]=useState(user.shopAddress || "")
    const [gstNumber,setGstNumber]=useState(user.gstNumber || "")
    const [loading,setLoading]=useState(false)
    const router= useRouter()
    const dispatch= useDispatch()

    const handleVerifyAgain = async ()=>{
        if(!shopName || !shopAddress || !gstNumber){
            alert("Fill all fields")
        }
        setLoading(true)
        try {
            const result= await axios.post("/api/vendor/verifyAgain",{
                shopName,
                shopAddress,
                gstNumber
            })
            setLoading(false)
            alert("verification request sent again")
            router.push("/")
        } catch (error) {
             setLoading(false)
             alert("verification request error" +  error)
        }
    }
    if(!user){
        return ( <div className=' w-full min-h-screen flex items-center justify-center text-white bg-linear-to-br from-gray-900 via-black to-gray-900'> Loading</div>
    )}

    if(user.verificationStatus == "approved"){
        return (
            <div className=' w-full min-h-screen pt-16'> <VendorDashboard/></div>
        )
    }
  if(user.verificationStatus == "pending"){
    return (
        <div className=' w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 '>
           <div className=' bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl  w-full text-center'>
           <h2 className=' text-4xl font-bold mb-6 text-blue-400'>Verification Pending</h2>
           <p className=' text-gray-200 text-lg leading-relaxed'> You 
            can access vendor dashboard only after <span className=' font-semibold'>admin verification</span>
           </p>
           <div  className=' mt-6 text-base text-gray-300'>

            VerificationStatus : {" "} <span className=' text-blue-400 font-semibold uppercase'>{user.verificationStatus}</span>
           </div>
           <div className=' mt-10 text-sm text-gray-400'> It usually takes 2-3 hours. </div>
           </div>
        </div>
    )
  }

  if(user.verificationStatus == "rejected"){
    return (
        <div className=' w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4'>
             <div className=' bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl  w-full text-center'>
           <h2 className=' text-4xl font-bold mb-6 text-red-400'>Verification Reject</h2>
           <p className=' text-gray-200 text-lg leading-relaxed'> Your business verification was rejected by   <span className=' font-semibold capitalize'>admin </span>
           </p>
           <div  className=' mt-6 text-base text-gray-300'>

            VerificationStatus : {" "} <span className=' text-blue-400 font-semibold uppercase'>{user.verificationStatus}</span>
           </div>
           <div className=' mt-5 mb-6 text-sm text-red-400 capitalize'>Rejected Reason: {user.rejectedReason } </div>
           {!openVerifyForm ? (
            <button className=' bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold' onClick={()=>setOpenVerifyForm(true)}>
                Verify Again
            </button>
           ):(
            <div className=' mt-6 text-left space-y-4'>
                <input type="text" placeholder=' Shop Name' className=' w-full p-3 rounded bg-white/10 border border-white/20'  onChange={(e)=>setShopName(e.target.value)} value={shopName}/>
                <input type="te xt" placeholder=' Shop Address' className=' w-full p-3 rounded bg-white/10 border border-white/20'  onChange={(e)=>setShopAddress(e.target.value)} value={shopAddress}/>
                <input type="text" placeholder=' GSTIN' className=' w-full p-3 rounded bg-white/10 border border-white/20'  onChange={(e)=>setGstNumber(e.target.value)} value={gstNumber}/>
                <button disabled={loading} onClick={handleVerifyAgain} className=' w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold'>{loading ? "Processing..." :"Submit & verify again"}</button>
                 <button className=' w-full bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold' onClick={()=>setOpenVerifyForm(false)}>Cencel</button>
            </div>
           )}
           </div>
        </div>
    )
  }
}

export default VendorPage