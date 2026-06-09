import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  try {
     await connectDb()
     const session = await auth()
     if(!session || !session.user?.email || !session.user.id){
        return NextResponse.json(
            {
                message:"Unauthorized User"
            },
            {status:400}
        )
     }
     const {productId,quantity}=await req.json()
         
     if(!productId || quantity <1){
        return NextResponse.json(
            {message:"Invalid Data"},
            {status:400}
        )
     }
     const user = await User.findById(session.user.id)
     if(!user || !user.cart){
        return NextResponse.json(
            {message:"User's cart is not found"},
            {status:400}
        )
     }
  
      const item= user.cart.find((item:any)=>item.product.toString()===productId.toString())

      if(!item){
        return NextResponse.json({message:"product is not found"},{status:404})
      }

      item.quantity = quantity
      await user.save()

      return NextResponse.json(
        {message:"Quantity updated",cart:user.cart},
        {status:200}
      )
  } catch (error) {
     return NextResponse.json(
        {message:`Failed to update cart error ${error}`},
        {status:500}
     )
  }
}