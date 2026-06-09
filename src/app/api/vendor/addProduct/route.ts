 
 import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

import uploadOnCloudinary from "@/lib/cloudinary";
import User from "@/model/user.model";



export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

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
      (formData.get("detailsPoints") as string) || "[]"
    );

    // ✅ validation
    if (!title || !price || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if(isWearable && sizes.length ===0){
        return NextResponse.json(
            {message:"Sizes are required for wearable product"},
            {status:400}
        )
    }
    // ✅ upload images
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "Images required" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];

    for (const file of files) {
      const url = await uploadOnCloudinary(file)
      uploadedImages.push(url)
    }

    // ✅ create product
    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      vendor: session.user.id,

      image1: uploadedImages[0],
      image2: uploadedImages[1] || "",
      image3: uploadedImages[2] || "",

      isWearable,
      size:  isWearable ? sizes : [],

      replacementDays,
      freeDelivery,
      warranty,
      payOnDelivery,

      detailsPoints,

      verificationStatus: "pending",
      requestedAt: new Date(),
    });

    await User.findByIdAndUpdate(session.user.id,{
        $push:{venderProducts:product._id}
    },{new:true})

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);

    return NextResponse.json(
      { message: "product create error ", error },
      { status: 500 }
    );
  }
}