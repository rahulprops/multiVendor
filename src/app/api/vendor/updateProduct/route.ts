
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDb";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 },
      );
    }
    const formData = await req.formData();
    const productId = formData.get("productId");
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product is not found" },
        { status: 400 },
      );
    }

    if (String(product.vendor) !== String(session.user.id)) {
      return NextResponse.json(
        { message: "Not allowed to edit this product" },
        { status: 403 },
      );
    }

    // ✅ get data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;

    const isWearable = formData.get("isWearable") === "true";
    const sizes = JSON.parse((formData.get("sizes") as string) || "[]");

    const replacementDays = Number(formData.get("replacementDays")) || 0;
    const freeDelivery = formData.get("freeDelivery") === "true";
    const warranty = (formData.get("warranty") as string) || "No Warranty";
    const payOnDelivery = formData.get("cashOnDelivery") === "true";

    const detailsPoints = JSON.parse(
      (formData.get("detailsPoints") as string) || "[]",
    );

    // ✅ validation
    if (!title || !price || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { message: "Sizes are required for wearable product" },
        { status: 400 },
      );
    }
    // ✅ upload images
    const files = formData.getAll("images") as File[];

    // ✅ upload images (FIXED)
    

    let image1 = product.image1;
    let image2 = product.image2;
    let image3 = product.image3;

    // check if new images uploaded
    if (files && files.length > 0 && files[0].size > 0) {
      const uploadedImages: string[] = [];

      for (const file of files) {
        if (file && file.size > 0) {
          const url = await uploadOnCloudinary(file);
          if (url) uploadedImages.push(url);
        }
      }

      // overwrite only if uploaded
      image1 = uploadedImages[0] || image1;
      image2 = uploadedImages[1] || image2;
      image3 = uploadedImages[2] || image3;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        stock,
        category,
        image1,
        image2,
        image3,

        isWearable,
        size: isWearable ? sizes : [],

        replacementDays,
        freeDelivery,
        warranty,
        payOnDelivery,

        detailsPoints,

        verificationStatus: "pending",
        requestedAt: new Date(),
      },
      { new: true },
    );

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `update product error ${error}` },
      { status: 500 },
    );
  }
}
