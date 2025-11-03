import React from 'react'
import { motion } from "framer-motion";
import Image from 'next/image'


const NavButton = React.forwardRef(({ name, className, textClassName, onClick }, ref) => {
    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            ref={ref} 
            onClick={onClick}
            className={`z-25 absolute flex justify-center w-[clamp(80px,18%,200px)] cursor-pointer paradose ${className}`}>
            <Image
                src='svg/NavBg.svg'
                alt={name}
                width={0}
                height={0}
                className='w-full h-auto'
                unoptimized={true}
            />
            <div className={`absolute flex justify-center items-center w-full h-full text-[clamp(0.5rem,1.2vw,1.4rem)] text-white ${textClassName}`}>{name}</div>
        </motion.div>
    )
})

NavButton.displayName = 'NavButton';

export default NavButton