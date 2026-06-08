import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
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

    const { vendorId, status, rejectedReason } = await req.json();

    // ✅ validation
    if (!vendorId || !status) {
      return NextResponse.json(
        { message: "vendorId and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // ✅ find vendor
    const vendor = await User.findById(vendorId);

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );
    }

    if (vendor.role !== "vendor") {
      return NextResponse.json(
        { message: "User is not a vendor" },
        { status: 400 }
      );
    }

    // ✅ update logic
    if (status === "approved") {
      vendor.verificationStatus = "approved";
      vendor.isApproved = true;
      vendor.approvedAt = new Date();
      vendor.rejectedReason = undefined;
    }

    if (status === "rejected") {
      vendor.verificationStatus = "rejected";
      vendor.isApproved = false;
      vendor.rejectedReason = rejectedReason || "Rejected by admin";
    }

    await vendor.save();

    return NextResponse.json(
      {
        
        message: "Vendor status updated",
        vendor,
      },
      { status: 200 }
    );

  } catch (error: any) {
    

    return NextResponse.json(
      {
        
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}