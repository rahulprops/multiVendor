import React from 'react'
import Slider from './Slider';
import CategorySlider from './CategorySlider';

const UserDashbaord = () => {
  return (
    <div className=' w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white '>
        <Slider/>
        <CategorySlider/>
    </div>
  )
}

export default UserDashbaord