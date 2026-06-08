"use client"
import slide1 from '@/assets/phone.webp'
import slide2 from '@/assets/shoes.webp'
import slide3 from '@/assets/womenf.jpg'
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Slider = () => {
    const [current, setCurrent]=useState(0)
    const sliders =[
        {
            image:slide2,
            title:"Run On AIR",
            subtitle:"DO IT NOW.",
            description:"Running shoes",
            button:"DISCOVER"
        },
        {
            image:slide1,
            title:"STYLE & COMFORT",
            subtitle:" NEW COLLECTION",
            description:"Women's Fashion Accessories",
            button:"DISCOVER"
        },
        {
            image:slide3,
            title:"Run On AIR",
            subtitle:"DO IT NOW.",
            description:"Running shoes",
            button:"DISCOVER"
        },
    ]

    useEffect(()=>{
    const interval = setInterval(()=>{
        setCurrent((prev)=>(prev + 1) % sliders.length)
    },5000)
    return ()=> clearInterval(interval)
    },[])

  return (
    <div className=" relative w-full min-h-[90vh] mt-0 overflow-hidden bg-black text-white md:mt-[60px] rounded-2xl" >
        <AnimatePresence>
            <motion.div 
             key={current}
             initial={{ opacity:0,scale:1.05}}
             animate={{ opacity:1,scale:1}}
             exit={{ opacity:0,scale:0.95}}
             transition={{ duration:0.8}}
            className=" absolute inset-0 flex justify-center items-center">
             <Image src={sliders[current].image} alt={sliders[current].title} className=" object-cover opacity-70" fill />
             <div className=" absolute inset-0 flex flex-col items-start justify-center px-10 md:px-24  bg-gradient-to-r  from-black/70 to-transparent">
              <motion.h3 className=" text-sm md:text-base uppercase tracking-widest text-gray-300"
               initial={{ y:20 , opacity:0}}
               animate={{ y:0,opacity:1}}
               transition={{ delay:0.2}}
              >
               {sliders[current].title}
 
              </motion.h3>
              <motion.h1 
               className=" text-4xl md:text-6xl font-bold mb-4 "
               initial={{ y:40, opacity:0}}
               animate={{ y:0,opacity:1}}
               transition={{ delay:0.4}}
              >
                {sliders[current].description}
              </motion.h1>
              <motion.p
               className=" text-lg md:text-xl text-gray-300 mb-6"
               initial={{ y:40,opacity:0}}
               animate={{ y:0,opacity:1}}
               transition={{ delay:0.6}}
              >
                {sliders[current].title}
              </motion.p>
              <motion.button
               className=" px-3 py-3 bg-blue-600 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition "
               whileHover={{ scale:1.05}}
               whileTap={{ scale:0.95}}
              >
              {sliders[current].button}
              </motion.button>
             </div>
            </motion.div> 
        </AnimatePresence>

        <div className=" absolute bottom-6 right-6 flex  gap-4">
                 { sliders.map((slide,index)=>(
                <motion.div key={index} 
                whileHover={{ scale:1.1}}
                onClick={()=>setCurrent(index)}
                 className={` relative w-20 h-12 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${ index === current ? " border-gray-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : " border-gray-600 hover:border-blue-400"}`}
                >
                <Image src={slide.image} alt={slide.title} fill className=" object-cover opacity-90" />
                </motion.div>
                 ))}
        </div>
    </div>
  )
}

export default Slider