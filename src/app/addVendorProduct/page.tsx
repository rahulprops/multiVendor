"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AddVendorProduct = () => {
  
    const categories=[
        "Fashio & Lifestyle",
        "Elcetronics & Gadgets",
        "Home & Living",
        "Beauty & Personal Care",
        "Toys , Kids & Baby",
        "Food & Grocery",
        "Sports & Fitness",
        "Automotive Accessories",
        "Gifts & Handcrafts",
        "Books & Stationery",
        "Others"
    ]

    const sizeOptions = ["XS","S","M","L","XL","XXL"]

  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    customCategory:"",
    description: "",
    isWearable: false,
    replacementDays: "",
    warranty: "",
    freeDelivery: false,
    cashOnDelivery: false,
  });

  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [preview, setPreview] = useState<string[]>(["", "", ""]);
  const [points, setPoints] = useState<string[]>([]);
  const [sizes,setSizes]=useState<string[]>([])
  const [pointInput, setPointInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router= useRouter()
  // handle input
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // sizes 
  const toggleSize=(size:string)=>{
    setSizes((prev)=>prev.includes(size)? prev.filter((s)=>s !==size): [...prev,size])
  }

  // image upload
  const handleImage = (e: any, index: number) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const newPreview = [...preview];
    newPreview[index] = URL.createObjectURL(file);
    setPreview(newPreview);
  };

  // add detail point
  const addPoint = () => {
    if (!pointInput.trim()) return;
    setPoints([...points, pointInput]);
    setPointInput("");
  };

  // submit
  const handleSubmit = async () => {
    

    if (!form.title || !form.price || !form.category) {
      return alert("Fill required fields");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category==="Others"? form.customCategory : form.category);
      formData.append("description", form.description);
      formData.append("isWearable", String(form.isWearable));
      formData.append("replacementDays", form.replacementDays);
      formData.append("warranty", form.warranty);
      formData.append("freeDelivery", String(form.freeDelivery));
      formData.append("cashOnDelivery", String(form.cashOnDelivery));
      formData.append("detailsPoints", JSON.stringify(points));
      formData.append("sizes",JSON.stringify(sizes))
      images.forEach((img) => {
        if (img) formData.append("images", img);
      });

      const result= await axios.post("/api/vendor/addProduct ", formData);
       console.log(result.data)
      alert("Product added successfully,Waiting for admin approval");
      setLoading(false);
      router.push("/")
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Error adding product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex justify-center items-center p-6 text-white">
      <motion.div
        
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Add New Product</h2>

        {/* Top Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Product Title"
            className="input"
            onChange={handleChange}
          />
          <input
            name="price"
            placeholder="Price"
            className="input"
            onChange={handleChange}
          />
          <input
            name="stock"
            placeholder="Stock Quantity"
            className="input"
            onChange={handleChange}
          />
          <select name="category" className="input" onChange={handleChange} >
            <option className=" bg-gray-800" value="">Select Category</option>
            {categories.map((cat)=>(
                <option key={cat} value={cat} className=" bg-gray-900">{cat}</option>
            ))}
          </select>
        </div>
          {/* other category show */}
          {form.category === "Others" && <input type="text"  className="input" name="customCategory" placeholder="Enter Custom Category" onChange={handleChange} />}

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          className="input h-24"
          onChange={handleChange}
        />

        {/* Wearable */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isWearable" onChange={handleChange} />
          This is wearable product
        </label>
           
           {form.isWearable && <div>
              <div className=" mt-4">
               <p className="  mb-2 text-sm font-semibold ">Select Sizes</p>
               <div className=" flex flex-wrap gap-3">
               {sizeOptions.map((size)=>(
                <button key={size} value={size} onClick={()=>toggleSize(size)} className={`px-4 py-1 rounded-full border ${
                    sizes.includes(size) ? "bg-blue-600 border-blue-500" :"bg-white/10 border-white/20"
                    }`}> {size}</button>
               ))}
               </div>
              </div>
            </div>}

        {/* Extra */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="replacementDays"
            placeholder="Replacement Days"
            className="input"
            onChange={handleChange}
          />
          <input
            name="warranty"
            placeholder="Warranty"
            className="input"
            onChange={handleChange}
          />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6 text-sm">
          <label>
            <input
              type="checkbox"
              name="freeDelivery"
              onChange={handleChange}
            />{" "}
            Free Delivery
          </label>
          <label>
            <input
              type="checkbox"
              name="cashOnDelivery"
              onChange={handleChange}
            />{" "}
            Cash on Delivery
          </label>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {preview.map((img, i) => (
            <label
              key={i}
              className="h-24 border border-white/20 rounded-lg flex items-center justify-center cursor-pointer bg-white/5"
            >
              {img ? (
                <Image alt="image" width={300} height={300} src={img} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">Image {i + 1}</span>
              )}
              <input
                type="file"
                hidden
                onChange={(e) => handleImage(e, i)}
              />
            </label>
          ))}
        </div>

        {/* Points */}
        <div className="flex gap-2">
          <input
            value={pointInput}
            onChange={(e) => setPointInput(e.target.value)}
            placeholder="Product detail point"
            className="input flex-1"
          />
          <button
            type="button"
            onClick={addPoint}
            className="bg-blue-600 px-4 rounded"
          >
            <AiOutlinePlus />
          </button>
        </div>

        <ul className="text-sm text-gray-300">
          {points.map((p, i) => (
            <li key={i}>• {p}</li>
          ))}
        </ul>

        {/* Submit */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          className="w-full py-3 bg-blue-600 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </motion.button>
      </motion.div>

      {/* Tailwind reusable class */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default AddVendorProduct;