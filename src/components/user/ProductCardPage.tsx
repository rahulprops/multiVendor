'use client'
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../ProductCart';


const ProductCardPage = () => {
    const allProductsData=useSelector((state:RootState)=>state.vendor.allProducts)

     const products= Array.isArray(allProductsData) ? allProductsData.filter((p:any)=>p.isActive === true && p.verificationStatus== "approved") : []

     

  return (
    <div className=' min-h-screen w-full bg-gradient-to-br  from-gray-900 via-black to-gray-900 px-4 py-6'>
         <div className=' max-w-7xl mx-auto mb-13 text-center'>
             <h1 className=' text-2xl sm:text-3xl font-bold text-white'>
                 Explore verified & Tednding Products 
             </h1>
             <p className=' text-sm text-gray-200'>Shop only form approved seelers with guaranted quality</p>

         </div>
         <div className=' max-w-7xl mx-auto'> 
            {products.length === 0 ? (
             <div className=' text-center text-gray-500 mt-20'>
                No products availabe right now. 
             </div>

            ) : (
                <div className=' grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
                    {products.map((p:any)=>
                       <ProductCard key={p._id} product={p}/>
                    )}
                </div>
            )}
         </div>
    </div>
  )
}

export default ProductCardPage