import { AppDispatch } from '@/redux/store';
import { setAllVendorData } from '@/redux/vendorSlice';
import axios from 'axios';
import  { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const UseGetAllVendors = () => {
  const dispatch = useDispatch<AppDispatch>()
     useEffect(()=>{
         const fetchUser = async ()=>{
            try {
               const result = await axios.get("/api/vendor/allVendors")
               console.log("hooke")
               console.log("vendorsall" , result.data)
            dispatch(setAllVendorData(result.data))  
            } catch (error) {
                 console.log(error)
                 dispatch(setAllVendorData([]))
            }
         }
         fetchUser()
     },[dispatch])
}

export default UseGetAllVendors