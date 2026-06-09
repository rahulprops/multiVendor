'use client'
import UseGetAllProducts from './hooks/UseGetAllProductData';
import UseGetAllVendors from './hooks/UseGetAllVendors';
import UseGetCurrentUser from './hooks/UseGetCurrentUser';

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  UseGetAllProducts()
  return null
}

export default InitUser