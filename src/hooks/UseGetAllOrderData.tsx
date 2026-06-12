"use client";

import { setAllOrdersData } from "@/redux/userSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const UseGetAllOrdersData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllOrders= async () => {
      try {
        const result = await axios.get("/api/order/allOrders");
        //  console.log(result.data)
        dispatch( setAllOrdersData(result.data));
      } catch (error) {
        console.error("Error fetching all products:", error);
        dispatch( setAllOrdersData([]));
      }
    };

    fetchAllOrders();
  }, [dispatch]);
};

export default UseGetAllOrdersData;
