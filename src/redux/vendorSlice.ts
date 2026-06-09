
import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";
import { createSlice } from "@reduxjs/toolkit"

interface IVendorData {
    vendorData: IUser[] ,
    allProducts: IProduct[]

}

const initialState: IVendorData={
    vendorData:[],
    allProducts:[]
    
}

const vendorSlice= createSlice({
    name:"vendor",
    initialState,
    reducers:{
         setAllVendorData:(state,action)=>{
            state.vendorData=action.payload
         },
          setAllProducts:(state,action)=>{
            state.allProducts=action.payload
         }   
            
    }
})

export const {setAllVendorData,setAllProducts} =vendorSlice.actions
export default vendorSlice.reducer