"use client";
import { IUser } from "@/model/user.model";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    AiOutlineAppstore,
    AiOutlineClose,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlinePhone,
  AiOutlineSearch,
  AiOutlineShop,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import logo from "@/assets/logo.png";
import { GoListUnordered } from "react-icons/go";

const Navbar = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const [openMenu, setMenu] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={logo}
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
            priority // ✅ fix LCP warning
          />
          <span className="text-xl font-semibold hidden sm:inline">
            MultiCart
          </span>
        </div>
        {/* Nav Links */}
        {user?.role == "user" && (
          <div className="hidden md:flex gap-8">
            <NavItem label="Home" path="/" router={router} />
            <NavItem label="Categories" path="/category" router={router} />
            <NavItem label="Shop" path="/shop" router={router} />
            <NavItem label="Orders" path="/orders" router={router} />
          </div>
        )}
        {/* desktop icons */}
        <div className=" hidden md:flex items-center gap-6">
          {user?.role == "user" && (
            <IconBtn
              Icon={AiOutlineSearch}
              onClick={() => router.push("/category")}
            />
          )}

          <IconBtn
            Icon={AiOutlinePhone}
            onClick={() => router.push("/support")}
          />
          <div className=" relative">
            {user?.image ? (
              <Image
                src={user?.image}
                alt="user"
                width={40}
                height={40}
                className=" w-10 h-10 rounded-full object-cover border border-gray-700 cursor-pointer"
                onClick={() => setMenu(!openMenu)}
              />
            ) : (
              <IconBtn
                Icon={AiOutlineUser}
                onClick={() => setMenu(!openMenu)}
              />
            )}
            <AnimatePresence>
              {openMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className=" absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c]"
                >
                  <DropDownBtn
                    Icon={AiOutlineUser}
                    label="Profile"
                    onClick={() => {
                      router.push("/profile");
                      setMenu(false);
                    }}
                  />
                  <DropDownBtn
                    Icon={AiOutlineLogin}
                    label="SignIn"
                    onClick={() => {
                      router.push("/login");
                      setMenu(false);
                    }}
                  />
                  <DropDownBtn
                    Icon={AiOutlineLogout}
                    label="SignOut"
                    onClick={() => {
                      signOut();
                      setMenu(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user?.role == "user" && (
            <CartBtn router={router} count={user.cart?.length} />
          )}
        </div>

        {/* mobile icons */}
        <div className=" md:hidden flex items-center gap-4">
          {user.role == "vendor" || user.role == "admin" ? (
            <>
              <IconBtn
                Icon={AiOutlinePhone}
                onClick={() => router.push("/support")}
              />
              <div className=" relative">
                {user?.image ? (
                  <Image
                    src={user?.image}
                    alt="user"
                    width={40}
                    height={40}
                    className=" w-10 h-10 rounded-full object-cover border border-gray-700 cursor-pointer"
                    onClick={() => setMenu(!openMenu)}
                  />
                ) : (
                  <IconBtn
                    Icon={AiOutlineUser}
                    onClick={() => setMenu(!openMenu)}
                  />
                )}
                <AnimatePresence>
                  {openMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className=" absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c]"
                    >
                      <DropDownBtn
                        Icon={AiOutlineUser}
                        label="Profile"
                        onClick={() => {
                          router.push("/profile");
                          setMenu(false);
                        }}
                      />
                      <DropDownBtn
                        Icon={AiOutlineLogin}
                        label="SignIn"
                        onClick={() => {
                          router.push("/login");
                          setMenu(false);
                        }}
                      />
                      <DropDownBtn
                        Icon={AiOutlineLogout}
                        label="SignOut"
                        onClick={() => {
                          signOut();
                          setMenu(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <IconBtn
                Icon={AiOutlineSearch}
                onClick={() => router.push("/category")}
              />
              <IconBtn
                Icon={AiOutlinePhone}
                onClick={() => router.push("/support")}
              />
              <CartBtn router={router} count="5" />
              <AiOutlineMenu
                size={28}
                className=" cursor-pointer"
                onClick={() => setSideBarOpen(true)}
              />

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className=" fixed top-0 right-0 h-screen w-[65%] bg-black/90 backdrop-blur-lg p-6 text-white"
                  >
                    <div className=" flex  justify-between items-center mx-6 mb-6">
                      <h1 className=" text-xl font-semibold">Menu</h1>
                      <AiOutlineClose
                        size={28}
                        className=" cursor-pointer"
                        onClick={() => setSideBarOpen(false)}
                      />
                    </div>
                    <div className=" flex flex-col gap-4 text-lg">
                      <SidebarBtn
                        label="Home"
                        Icon={AiOutlineHome}
                        path={"/"}
                        router={router}
                        setSideBarOpen={setSideBarOpen}
                      />
                      <SidebarBtn
                        label="Categories"
                        Icon={AiOutlineAppstore}
                        path={"/category"}
                        router={router}
                        setSideBarOpen={setSideBarOpen}
                      />
                      <SidebarBtn
                        label="Shops"
                        Icon={AiOutlineShop}
                        path={"/shop"}
                        router={router}
                        setSideBarOpen={setSideBarOpen}
                      />
                      <SidebarBtn
                        label="Ordres"
                        Icon={GoListUnordered}
                        path={"/orders"}
                        router={router}
                        setSideBarOpen={setSideBarOpen}
                      />
                      <SidebarBtn
                        label="Profile"
                        Icon={AiOutlineUser}
                        path={"/profile"}
                        router={router}
                        setSideBarOpen={setSideBarOpen}
                      />
                      <SidebarBtn
                        label="SignIn"
                        Icon={AiOutlineAppstore}
                        path={"/login"}
                        router={router}
                        setSideBarOpen={setSideBarOpen}
                      />
                      <SidebarBtnforSignOut
                        label="SignOut"
                        Icon={AiOutlineLogout}
                        setSideBarOpen={setSideBarOpen}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const NavItem = ({ label, path, router }: any) => (
  <motion.button
    onClick={() => router.push(path)}
    className="relative text-gray-300"
    whileHover="hover"
    initial="rest"
    animate="rest"
  >
    {label}

    {/* underline animation */}
    <motion.span
      variants={{
        rest: { width: 0 },
        hover: { width: "100%" },
      }}
      transition={{ duration: 0.3 }}
      className="absolute left-0 -bottom-1 h-[2px] bg-blue-500"
    />
  </motion.button>
);

const IconBtn = ({ Icon, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
    className="hover:text-blue-400"
  >
    <Icon size={24} />
  </motion.button>
);

const DropDownBtn = ({ Icon, label, onClick }: any) => (
  <button
    className=" flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 text-left"
    onClick={onClick}
  >
    <Icon size={18} /> {label}
  </button>
);

const CartBtn = ({ router, count }: any) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => router.push("/cart")}
    className="relative"
  >
    <AiOutlineShoppingCart size={24} />

    {count > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-1"
      >
        {count}
      </motion.span>
    )}
  </motion.button>
);

const SidebarBtn = ({ label, path, router, Icon, setSideBarOpen }: any) => (
  <motion.button
    variants={{
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    }}
    whileHover={{ scale: 1.05, x: 5 }}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-left"
    onClick={() => {
      router.push(path);
      setSideBarOpen(false);
    }}
  >
    <Icon size={20} /> {label}
  </motion.button>
);


const SidebarBtnforSignOut= ({ label,Icon,setSideBarOpen}:any)=>(
    <button className=" flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left" onClick={()=>{signOut();setSideBarOpen(false)}}>
        <Icon size={20} /> {label}
    </button>
)