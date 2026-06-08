'use client'
import UseGetAllVendors from './hooks/UseGetAllVendors';
import UseGetCurrentUser from './hooks/UseGetCurrentUser';

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  return null
}

export default InitUser