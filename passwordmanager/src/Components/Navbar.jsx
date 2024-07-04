import React from 'react'
import { FaGithub } from "react-icons/fa";



function Navbar() {
  return (
    <div className='w-full h-[90px] sm:flex-shrink-0 flex-shrink bg-black shadow-lg
     text-white flex items-center justify-around '>

      {/* logo */}
      <div className="flex gap-1 font-sarif sm:text-3xl text-xl">
        <span>&lt;&lt;&lt;</span>
        <span className='text-green-500'>Saad</span>
        <span>Passweb</span>
        <span>/&gt;&gt;&gt;</span>
      </div>
      
      {/* Github Icon */}
      <a href="https://github.com/saadahmedacademy">
        <div className=" flex gap-2 justify-center items-center
        px-3 bg-green-700 font-bold sm:w-50 sm:w-40 w-[6rem] h-10 rounded-lg">  
            <FaGithub className='text-2xl' /><p>Github</p>
        </div>
        </a>

    </div>
  )
}

export default Navbar;