import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
 

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    // ✅ session check
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ check admin
    const adminUser = await User.findById(session.user.id);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can approve vendors" },
        { status: 403 }
      );
    }

    const { productId, status, rejectedReason } = await req.json();

    // ✅ validation
    if (!productId || !status) {
      return NextResponse.json(
        { message: "productId and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // ✅ find product
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Prouduct is not found" },
        { status: 404 }
      );
    }

    

    // ✅ update logic
    if (status === "approved") {
      product.verificationStatus = "approved";
      
      product.approvedAt = new Date();
      product.rejectedReason = undefined;
    }

    if (status === "rejected") {
      product.verificationStatus = "rejected";
     
      product.rejectedReason = rejectedReason || "Rejected by admin";
    }

    await product.save();

    return NextResponse.json(
      {
        
        message: "Product status updated",
        product,
      },
      { status: 200 }
    );

  } catch (error: any) {
    

    return NextResponse.json(
      {
        
        message:` product approced failed ${error}`
      },
      { status: 500 }
    );
  }
}