import connectDb from "@/lib/connectDb";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
          await connectDb()
         const admin= await User.findOne({role:"admin"})
         return NextResponse.json(
            {exists: !!admin},
            {status:200}         // return true or false
         )
    } catch (error) {
        return NextResponse.json(
            {message:`check-admin error ${error}`},
            {status:500}
        )
    }
 }