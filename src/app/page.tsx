import { auth } from "@/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UserDashbaord from "@/components/user/UserDashbaord";
import EditVendorDetails from "@/components/vendor/EditVendorDetails";
import VendorPage from "@/components/vendor/VendorPage";
import connectDb from "@/lib/connectDb";
import User from "@/model/user.model";
import { redirect } from "next/navigation";



export default async function Home() {
    
   await connectDb()

   const session =  await auth()
  //  console.log(session)
  const user = await User.findById( session?.user?.id)

  if(!user){
    redirect("/logic")
  }
  
  const inComplate = !user.role || !user.phone;

  if(inComplate){
    return <EditRoleAndPhone/>
  }

  if(user?.role == "vendor"){
    const isComplateDetails= !user.shopName || !user.shopAddress || !user.gstNumber
    if(isComplateDetails){
     return  <EditVendorDetails/>
    }
   }

  const PlainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex flex-col overflow-hidden">
      <Navbar user={PlainUser}/>

      {/* MAIN CONTENT (scroll here) */}
    <main className="flex-1 overflow-y-auto">
      {user?.role == "user" ? (
        <UserDashbaord/>
      ) : user?.role == "vendor" ? (
        <VendorPage user={PlainUser} />
      ) : (
        <AdminDashboard />
      )}
    </main>
     
     {/* footer  */}
     <Footer user={PlainUser}/>
    </div>
  );
}
