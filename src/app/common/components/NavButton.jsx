import React from 'react'
import { motion } from "framer-motion";
import Image from 'next/image'


const NavButton = React.forwardRef(({ name, className, textClassName, onClick }, ref) => {
    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            ref={ref} 
            onClick={onClick}
            className={`z-25 relative flex justify-center w-[36%] h-[2.5vh]  cursor-pointer paradose ${className}`}>
            <Image
                src='svg/NavBg.svg'
                alt={name}
                width={0}
                height={0}
                className='absolute w-full h-auto'
                unoptimized={true}
            />
            <div className={`absolute flex justify-center w-full text-[clamp(0.8rem,1.6vw,1.8rem)] top-[10%] sm:top-[55%] ${textClassName}`}>{name}</div>
        </motion.div>
    )
})

NavButton.displayName = 'NavButton';

export default NavButton