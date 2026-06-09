
"use client";

import { setAllProducts } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const UseGetAllProducts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllProduct= async () => {
      try {
        const result = await axios.get("/api/vendor/allProduct");
        //  console.log(result.data)
        dispatch( setAllProducts(result.data));
      } catch (error) {
        console.error("Error fetching all products:", error);
        dispatch( setAllProducts([]));
      }
    };

    fetchAllProduct();
  }, [dispatch]);
};

export default UseGetAllProducts;
