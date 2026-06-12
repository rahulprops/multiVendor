import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
import Order from "@/model/order.model";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 400 }
      );
    }

    const orders = await Order.find() // ✅ FIXED
      .populate("buyer", "name email phone image")
      .populate("productVendor", "name shopName email")
      .populate({
        path: "products.product",
        model: "Product",
        select: "title image1 price category stock vendor replacementDays",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Failed to get all orders: ${error.message}` }, // cleaner error
      { status: 500 }
    );
  }
}