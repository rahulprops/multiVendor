import connectDb from "@/lib/connectDb";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required" },
        { status: 400 },
      );
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    if (order.orderStatus === "returned") {
      return NextResponse.json(
        { message: "order already returned" },
        { status: 400 },
      );
    }
    if (order.orderStatus === "cancelled") {
      return NextResponse.json(
        { message: "Cancellled order cannot be returned" },
        { status: 400 },
      );
    }

    if (order.orderStatus !== "delivered") {
      return NextResponse.json(
        { message: "Only delivered orders can be returned" },
        { status: 400 },
      );
    }

    let returnedAmount = 0;
    for (const item of order.products) {
      returnedAmount += item.price * item.quantity;
    }
    order.orderStatus = "returned";
    order.returnedAmount = returnedAmount;
    await order.save();
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `falied to returned amount ${error}` },
      { status: 500 },
    );
  }
}
