import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from "motion/react";
import gsap from 'gsap';
import getTimeLeft from '../utils/getTimeLeft.js';

const Timer = ({ animateText, onRegisterClick }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const registerTextRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Animate the register text when animateText becomes true
        if (animateText && registerTextRef.current) {
            gsap.to(registerTextRef.current.children, 
                { filter: 'blur(0px)', duration: 0.8, ease: "power2.out", stagger: 0.1 }
            );
        }
    }, [animateText]);

    return (
        <>
            <Image
                src="/svg/Registrations.svg"
                width={0}
                height={0}
                alt="Register Now"
                className="pointer-events-none w-full h-full"
            />
            <motion.button
                whileHover={{ scale: 1.0 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRegisterClick}
                className='absolute w-[30%]  bg-[#CC0E3E] cursor-pointer rounded-2xl p-3 -top-[10%]  z-100 px-4'>
                <h1 ref={registerTextRef} className='text-4xl text-white kamal'>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>R</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>e</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>g</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>i</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>s</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>t</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>e</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>r</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)', margin: '0 4px' }}>&nbsp;</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>N</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>o</span>
                    <span style={{ display: 'inline-block', filter: 'blur(10px)' }}>w</span>
                </h1>
            </motion.button>
            <div className='flex justify-center absolute bottom-2 w-full gap-2 pb-2'>
                <div className='w-[15%] flex flex-col right-[65%] justify-center items-center content-center top-[45%]'>
                    <h1 className='text-white text-7xl'>{String(timeLeft.days).padStart(2, '0')}</h1>
                    <h1 className='text-white text-3xl -mt-2'>Days</h1>
                </div>
                <div className='text-white text-7xl self-center'>:</div>
                <div className='w-[15%] flex flex-col right-[50%] justify-center items-center content-center top-[45%]'>
                    <h1 className='text-white text-7xl'>{String(timeLeft.hours).padStart(2, '0')}</h1>
                    <h1 className='text-white text-3xl -mt-2'>Hours</h1>
                </div>
                <div className='text-white text-7xl self-center'>:</div>
                <div className='w-[15%] flex flex-col right-[35%] justify-center items-center content-center top-[45%] mr-6'>
                    <h1 className='text-white text-7xl'>{String(timeLeft.minutes).padStart(2, '0')}</h1>
                    <h1 className='text-white text-3xl -mt-2'>Minutes</h1>
                </div>
                <div className='text-white text-7xl self-center'>:</div>
                <div className='w-[15%] flex flex-col right-[20%] justify-center items-center content-center top-[45%]'>
                    <h1 className='text-white text-7xl'>{String(timeLeft.seconds).padStart(2, '0')}</h1>
                    <h1 className='text-white text-3xl -mt-2'>Seconds</h1>
                </div>
            </div>
        </>
    );
};

export default Timer;