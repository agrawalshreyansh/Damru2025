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
                className='absolute w-[clamp(160px,30%,360px)] bg-[#CC0E3E] cursor-pointer rounded-2xl p-[clamp(0.4rem,0.8vw,0.8rem)] -top-[24%] z-100 px-[clamp(0.7rem,1.4vw,1.4rem)]'>
                <h1 ref={registerTextRef} className='text-[clamp(1.2rem,2.2vw,2rem)] text-white kamal whitespace-nowrap'>
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
            <div className='flex justify-center absolute bottom-2 w-full gap-[clamp(0.2rem,0.4vw,0.4rem)] pb-[clamp(0.2rem,0.4vw,0.4rem)]'>
                <div className='w-[clamp(40px,12%,100px)] flex flex-col right-[65%] justify-center items-center content-center top-[45%]'>
                    <h1 className='text-white text-[clamp(2.2rem,5.2vw,5.2rem)]'>{String(timeLeft.days).padStart(2, '0')}</h1>
                    <h1 className='text-white text-[clamp(0.6rem,1.5vw,1.5rem)] -mt-[clamp(1.0rem,2.0vw,2.0rem)]'>Days</h1>
                </div>
                <div className='text-white text-[clamp(2.0rem,4.8vw,4.6rem)] self-center'>:</div>
                <div className='w-[clamp(40px,12%,100px)] flex flex-col right-[50%] justify-center items-center content-center top-[45%]'>
                    <h1 className='text-white text-[clamp(2.0rem,4.8vw,4.6rem)]'>{String(timeLeft.hours).padStart(2, '0')}</h1>
                    <h1 className='text-white text-[clamp(0.6rem,1.5vw,1.5rem)] -mt-[clamp(1.0rem,2.0vw,2.0rem)]'>Hours</h1>
                </div>
                <div className='text-white text-[clamp(2.0rem,4.8vw,4.6rem)] self-center'>:</div>
                <div className='w-[clamp(40px,12%,100px)] flex flex-col right-[35%] justify-center items-center content-center top-[45%] mr-[clamp(0.4rem,1.2vw,1.2rem)]'>
                    <h1 className='text-white text-[clamp(2.0rem,4.8vw,4.6rem)]'>{String(timeLeft.minutes).padStart(2, '0')}</h1>
                    <h1 className='text-white text-[clamp(0.6rem,1.5vw,1.5rem)] -mt-[clamp(1.0rem,2.0vw,2.0rem)]'>Minutes</h1>
                </div>
                <div className='text-white text-[clamp(2.0rem,4.8vw,4.6rem)] self-center'>:</div>
                <div className='w-[clamp(40px,12%,100px)] flex flex-col right-[20%] justify-center items-center content-center top-[45%]'>
                    <h1 className='text-white text-[clamp(2.0rem,4.8vw,4.6rem)]'>{String(timeLeft.seconds).padStart(2, '0')}</h1>
                    <h1 className='text-white text-[clamp(0.6rem,1.5vw,1.5rem)] -mt-[clamp(1.0rem,2.0vw,2.0rem)]'>Seconds</h1>
                </div>
            </div>
        </>
    );
};

export default Timer;