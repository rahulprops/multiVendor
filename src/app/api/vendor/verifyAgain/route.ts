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
        { message: "Unauthorized access" },
        { status: 400 },
      );
    }
    const updateVendor = await User.findOneAndUpdate(
      { email: session.user?.email },
      {
        shopName,
        shopAddress,
        gstNumber,
        verificationStatus: "pending",
        rejectedReason:null,
        isApproved:false,
        requestAt: new Date(),
      },
      { new: true },
    );
    if(!updateVendor){
        return NextResponse.json(
            { message:"vendor is not found"},
            {status:401}
        )
    }
    return NextResponse.json({message:"Verify Again sucessful",updateVendor},{status:200})
  } catch (error) {
    return NextResponse.json(
        {message:`Edit vendor details error ${error}`},
        {status:500}
    )
  }
}