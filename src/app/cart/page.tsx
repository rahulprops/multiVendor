'use client'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Cart = () => {
  const [cart,setCart]=useState<any[] | null>([] || null)
   const router = useRouter()
  const getCart= async ()=>{
    try {
       const result= await axios.get("/api/user/cart/get")
       setCart(result.data.cart || [])
       console.log(result.data)
    } catch (error) {
      console.log(error)
      alert("failed to get cart")
    }
   }

  useEffect(()=>{
   
   getCart()
  },[])

  // handle update cart

  const handleUpdateCart= async (productId:string,quantity:number)=>{
     try {
        const result= await axios.post("/api/user/cart/update",{ productId,quantity})
         getCart()
     } catch (error) {
       console.log(error)
       alert("failed to update quantity")
     }
  }

  // handle remve cart
  const handleRemove= async (productId:string)=>{
    setCart((prev)=>prev.filter((i)=>i.product._id !==productId))
    await axios.post("/api/user/cart/remove",{productId})
  }
  if(cart?.length === 0){
    return <div className=' min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6'>Cart Empty</div>
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
      <div className=' max-w-5xl mx-auto space-y-4'>
        {cart.map((item,index)=>(
          <div key={index} className=' bg-white/10 p-4 rounded-lg flex gap-4'>
            <Image src={item.product.image1}  alt={item.product.title} width={100} height={100} />
            <div className=' flex-1'>
              <h3 className=' font-bold'>{item.product.title}</h3>
              <p className=' text-green-500'> {item.product.price}</p>
              <div className=' flex gap-2 mt-2'>
                <button onClick={()=>handleUpdateCart(item.product._id,item.quantity -1)} className=' border border-gray-600 px-2 rounded'>-</button>
                <span>{item.quantity}</span>
                <button onClick={()=>handleUpdateCart(item.product._id,item.quantity+1)} className=' border border-gray-600 px-2 rounded'>+</button>
              </div>
              <div className=' w-full flex items-center justify-start gap-4'>
              <button onClick={()=>router.push(`/checkout/${item.product._id}`)} className=' mt-3 bg-blue-600 px-4 py-2 rounded'> Checkout this Product</button>
              <button onClick={()=>handleRemove(item.product._id)} className=' mt-3 bg-red-400 text-red-600 px-4  py-2 rounded '> Remove</button>
              </div>
            </div>
            
            <div className=' font-bold'>
                 {item.product.price * item.quantity}
            </div>
          </div>
        ))}

      </div>

    </div>
  )
}

export default Cart