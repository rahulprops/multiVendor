"use client";
import ProductCard from "@/components/ProductCart";

import UseGetAllProducts from "@/hooks/UseGetAllProductData";
import { IProduct } from "@/model/product.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { motion } from "motion/react";
import { tr } from "motion/react-m";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegStar, FaStar, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const ViewProduct = () => {
  const params = useParams();
  const productId = params.id as string;
  UseGetAllProducts();
 const [reviewRating,setReviewRating]=useState(0);
 const [reviewComment,setReviewComment]=useState("")
 const [reviewImage,setReviewImage]=useState<File | null>(null)
 const [preview,setPreview]=useState<string | null>(null)
 const [loading,setLoading]=useState(false)
 const router =useRouter()
  const allProductsData = useSelector(
    (state: RootState) => state.vendor.allProducts,
  );

  const product: IProduct | undefined = allProductsData.find(
    (p: IProduct) => String(p._id) === String(productId),
  );
  //  console.log("vewproduct",product)
  const images: string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
  ].filter((img): img is string => Boolean(img));

  const totalReviews= product?.reviews?.length ?? 0;
  
  const avgRating= product && totalReviews > 0 ? (
    product.reviews!.reduce((sum:number , r:{rating:number})=> sum + r.rating,0)/totalReviews
  ).toFixed(1) : 0
 
  const relativeProducts= allProductsData.filter((p)=>p.category === product?.category && p._id !== product._id)

  const [activeImage, setActiveImage] = useState(0);

  const handleSubmitReview= async ()=>{
    const formData= new FormData()
    formData.append("productId",String(productId))
    formData.append("rating",String(reviewRating))
    formData.append("comment",reviewComment)
    if(reviewImage){
        formData.append("file",reviewImage)
    }
    setLoading(true)
    try {
         const result= await axios.post("/api/vendor/addReview",formData)
         if(result){
             setLoading(false)
            alert(" Review Added sucessfully")
            setPreview("")
            setReviewComment("")
            setReviewRating(0)
            setReviewImage(null)
           

         }
    } catch (error) {
         console.log(error)
          setLoading(false)
         alert("add review failed")
        
    }
  }

  const handleAddtoCart= async (e:React.MouseEvent)=>{
          e.stopPropagation()
          try {
            const result= await axios.post("/api/user/cart/add",{
              productId,
              quantity:1
            })
            console.log(result.data)
            alert("Added to cart")
            router.push("/cart")
          } catch (error) {
             console.log(error)
             alert("add to cart error")
          }
        }
  return (
    <div className=" min-h-screen bg-linear-to-br from-gray-800 via-black to-gray-900 px-4 py-10">
      <div className=" max-w-6xl mx-auto">
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* left lop */}
          <div className=" flex flex-col md:flex-col lg:flex-row gap-4">
            {/* main image */}
            <div
              className=" relative w-full lg:
                    w-[450px] h-[420px] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-white/10"
            >
              {images.length > 0 && images[activeImage] && (
                <Image
                  src={images[activeImage]}
                  alt={product?.title ?? "product image"}
                  fill
                  className=" object-contain"
                  priority
                />
              )}
            </div>
            {/* image thubnails */}
            <div className=" flex flex-row lg:flex-col gap-3 justify-center">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={` relative w-20 h-20 border rounded cursor-pointer hover:scale-[110%] transition-all ${activeImage === i ? " border-blue-600" : "border-white/20"}`}
                >
                  <Image src={img} alt="img" fill className=" object-contain" />
                </div>
              ))}
            </div>
          </div>
          {/* right botto */}
          {product && (
            <div>
              <h3 className=" text-3xl text-white font-bold mb-3">
                {product?.title}
              </h3>
              <p className=" text-gray-400 mb-2">{product?.category}</p>
              <p className=" text-green-500 font-bold text-2xl">
                {product?.price}
              </p>
              <div className=" flex items-center gap-2 mt-1 mb-4">
                <div className=" flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    i<= Math.round(Number(avgRating)) ?
                    <FaStar key={i} /> : <FaRegStar key={i} />
                  ))}
                </div>
                <span className=" text-sm text-gray-400">
                  ({avgRating}/ {totalReviews}) Reviews
                </span>
              </div>
              <p className=" mb-4 text-gray-300">{product?.description}</p>
              <p className=" mb-3 text-gray-50">
                Stock{" "}
                <span
                  className={
                    product.stock > 0 ? " text-green-400" : " text-red-400"
                  }
                >
                  {" "}
                  {product?.stock > 0 ? "In Stock" : " Out of Stock"}
                </span>
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddtoCart}
                className=" w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition"
              >
                Add to Cart
              </motion.button>
            </div>
          )}
        </div>
        {product && (
          <div className=" mt-10 bg-white/5 border border-white/10 rounded-lg p-6">
            {product.isWearable && (
              <div className=" mb-5">
                <p className=" font-semibold mb-2 text-white">
                  Available Sizes
                </p>
                <div className=" flex flex-wrap gap-2">
                  {product.size?.map((s) => (
                    <span
                      key={s}
                      className=" px-3 py-1 border bg-white border-white/20 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className=" space-y-2 mb-6 text-gray-300">
              {typeof product.replacementDays === "number" &&
                product.replacementDays > 0 && (
                  <p> ✔️ {product.replacementDays} Days Replacement</p>
                )}
              {product.freeDelivery === true && <p>✔️ Free Delivery</p>}
              {product.payOnDelivery === true && (
                <p>✔️ Cash on Delivery Available </p>
              )}
              {product.warranty && product.warranty !== "No Warranty" && (
                <p>✔️  Warranty : {product.warranty} </p>
              )}
            </div>
            {Array.isArray(product.detailsPoints) && product.detailsPoints.length > 0 && (
                <div className=" mb-6">
                    <h3 className=" font-semibold mb-2 text-white"> Highlights</h3>
                    <ul className=" list-disc pl-5 space-y-1 text-gray-300">
                        {product.detailsPoints.map((p,i)=>(
                            <li key={i}> {p}</li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        )}

        {Array.isArray(relativeProducts) && relativeProducts.length>0 && (
            <div className=" mt-12">
                <h3 className=" text-2xl font-bold mb-5 text-white "> Relative Products</h3>
                <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                     {relativeProducts.slice(0,8).map((rp)=>(
                    <ProductCard key={rp._id?.toString()} product={rp} />
                 ))}
                </div>
            </div>
        )}
          {/* review section */}
        <div className=" mt-16 rounded p-4 text-white bg-white/10 border border-white/10 ">
            <h2 className=" text-2xl  font-bold mb-6">
                Customer Reivews
            </h2>
            <div className=" mb-6">
                <p className=" text-white capitalize font-semibold mb-3"> Add your Review </p>
                <div className=" flex gap-2 mb-3 text-yellow-400">
                    {
                        [1,2,3,4,5].map((i)=>(
                            <span onClick={()=>setReviewRating(i)} className=" cursor-pointer" key={i}> {i <= reviewRating ? <FaStar/> : <FaRegStar/>}</span>
                        ))
                    }
                </div>
                <textarea placeholder=" write a review..." 
                 onChange={(e)=>setReviewComment(e.target.value)}
                 value={reviewComment}
                name="" id="" className=" w-full p-2 rounded bg-black text-white border border-white/20 mb-3" rows={3} />

               <div className=" flex flex-col">
                 <label htmlFor="img" className=" text-white font-semibold mb-2 ">Select Image for review </label>
                <input type="file" accept="image/*"  id="img" className=" mb-3 p-3 w-[250px] rounded-lg text-white bg-black" onChange={(e)=>{
                    const file = e.target.files?.[0]
                    if(file){
                        setReviewImage(file)
                        setPreview(URL.createObjectURL(file))
                    }
                }}/>
               </div>

                {preview && <Image  src={preview} alt="reviewimage" width={100} height={100} className="rounded mb-3"/>}
            </div>
            <motion.button 
             whileHover={{ scale:1.04}}
             whileTap={{ scale:0.97}}
               onClick={handleSubmitReview}
               disabled={loading}
            className=" bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold ">{loading ? "Submitting..." : "Submit review "}</motion.button>
        </div>

        {/* reviews show */}
        {product?.reviews && product.reviews.length > 0 ? (
            <h2 className=" text-white font-semibold mb-2 text-2xl">All Reviews</h2>
           
            ) :(
                 <h2 className=" text-white font-semibold mb-2 text-2xl">No Review found</h2> 
            )}

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {product?.reviews && product.reviews.length > 0 && (
                product.reviews.map((r,i)=>
                 <div key={i} className=" w-[250px] bg-white border border-black/10 rounded-xl p-5">
                    <div className=" flex items-center gap-3 mb-2">
                      <div className=" w-10 h-10 rounded-full  flex items-center justify-center bg-black"> 
                       {r.user.image ? ( <Image src={r.user.image} alt={r.user.name || "user"} width={40} height={40} className=" w-9 h-9 rounded-full object-cover"/>): (<FaUserCircle className=" w-8 h-8"/>)}
                      </div>
                      <div>
                        <p className=" text-black font-semibold text-sm">{r.user.name}</p>
                        <div className=" flex text-yellow-400 text-sm">
                            {[1,2,3,4,5].map((i)=>(
                                i<= r.rating ? <FaStar key={i} /> : <FaRegStar  key={i}/>
                            ))}
                        </div>
                      </div>
                      
                    </div>
                    <p className=" text-gray-900 text-sm mb-3">
                         {r.comment}
                         </p>
                {r.image ? <div className=" w-[180px] h-[230px] border border-white/10 rounded-lg overflow-hidden bg-black">
                  <Image src={r.image} alt="reviewImage" width={180} height={180}  className=" object-contain"/>
                </div> : <div className=" w-[180px] h-[230px] border border-white/10 rounded-lg overflow-hidden bg-gray-400 flex items-center justify-center text-white text-sm">
                   No review image
                </div>}
                 </div>
                )
            )}
            
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
