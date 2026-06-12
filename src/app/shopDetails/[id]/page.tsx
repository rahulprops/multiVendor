'use client'
import ProductCard from '@/components/ProductCart';
// import ProductCard from '@/component/ProductCard'
// import ProductCard from '@/component/ProductCard'
import UseGetAllProducts from '@/hooks/UseGetAllProductData'
import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { RootState } from '@/redux/store'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

 const ShopDetails = () => {
  UseGetAllProducts()
  UseGetAllVendors()
  const params = useParams()
  const vendorId = params.id as string;
  const allVendorsData = useSelector((state:RootState)=>state.vendor.vendorData)
  const allProductData = useSelector((state:RootState)=>state.vendor.allProducts)

  const vendor = allVendorsData.find((v:any)=>String(v._id)===vendorId)
   
  if(!vendor){
    return (
      <div  className=' min-h-screen flex items-center justify-center text-white bg-black text-3xl'>Vendor Not Found</div>
    )
  }

  const vendorProducts= Array.isArray(allProductData)? allProductData.filter((p:any)=>p.vendor._id === vendor._id) : []
  return (
    <div className=' min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
      <motion.div 
       initial={{ opacity:0,y:40}}
       animate={{ opacity:1,y:0}}
       transition={{ duration:0.6}}
      className=' max-w-6xl mx-auto mb-12 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 grid md:grid-cols-2 gap-6 shadow-xl'>
        <div className=' relative w-full h-60 overflow-hidden rounded-xl bg-black flex justify-center items-center'>
          {vendor.image ? <Image src={vendor.image} alt='image' fill className=' object-cover' /> : <span className=' text-white'>No image found</span>}
        </div>
        <div className=' flex flex-col justify-center'>
          <h1 className=' text-3xl font-bold mb-3'> {vendor.shopName}</h1>
          <p className=' text-gray-300 mb-2'>{vendor.shopAddress}</p>
          <p className=' text-sm text-gray-400 mb-1'>GSTIN: {vendor.gstNumber}</p>
          <span className=' text-[10px] w-fit mt-2 px-3 py-1 rounded-full font-medium bg-green-100 text-green-700'> {vendor.verificationStatus}</span>
        </div>
      </motion.div>
      <div className=' max-w-6xl mx-auto'>
        <h2 className=' text-2xl font-bold mb-8'>Product By :{vendor.shopName}</h2>
        {vendorProducts.length === 0 ? (
          <p  className=' text-gray-300'> No products added by this shop yet</p>
        ):(
          <div className=' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {vendorProducts.map((p:any,i:number)=>(
              <ProductCard key={i} product={p}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopDetails