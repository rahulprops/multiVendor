import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { shopName, shopAddress, gstNumber } = await req.json();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Anauthorized access" },
        { status: 400 },
      );
    }
    const user = await User.findOneAndUpdate(
      { email: session.user?.email },
      {
        shopName,
        shopAddress,
        gstNumber,
        verificationStatus: "pending",
        requestAt: new Date(),
      },
      { new: true },
    );
    if(!user){
        return NextResponse.json(
            { message:"User is not found"},
            {status:401}
        )
    }
    return NextResponse.json({message:"Vendor details submitted",user},{status:200})
  } catch (error) {
    return NextResponse.json(
        {message:`Edit vendor details error ${error}`},
        {status:500}
    )
  }
}
