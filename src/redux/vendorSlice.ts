
import { IUser } from "@/model/user.model";
import { createSlice } from "@reduxjs/toolkit"

interface IVendorData {
    vendorData: IUser[] ,

}

const initialState: IVendorData={
    vendorData:[],
    
}

const vendorSlice= createSlice({
    name:"vendor",
    initialState,
    reducers:{
         setAllVendorData:(state,action)=>{
            state.vendorData=action.payload
         },
            
    }
})

export const {setAllVendorData} =vendorSlice.actions
export default vendorSlice.reducer