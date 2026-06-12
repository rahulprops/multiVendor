import connectDb from "@/lib/connectDb";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || ""
    const category = searchParams.get("category");
    const shop = searchParams.get("shop");

    const filter: any = {
      isActive: true,

      verificationStatus: "approved",
    };

    // 🔍 Search filter
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    // 📂 Category filter
    if (category && category !== "all") {
      filter.category = category;
    }

    // 🏪 Shop filter
    if (shop && shop !== "all") {
      filter.vendor = shop;
    }
    console.log(filter);
    const products = await Product.find(filter).populate("vendor", "shopName image")
      .sort({ createdAt: -1 })
      .limit(50);
   
    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch products: ${error}`,
      },
      { status: 500 },
    );
  }
}
