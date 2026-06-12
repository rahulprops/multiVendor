'use client'
import UseGetAllOrdersData from './hooks/UseGetAllOrderData';
import UseGetAllProducts from './hooks/UseGetAllProductData';
import UseGetAllVendors from './hooks/UseGetAllVendors';
import UseGetCurrentUser from './hooks/UseGetCurrentUser';

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  UseGetAllProducts()
  UseGetAllOrdersData()
  return null
}

export default InitUser