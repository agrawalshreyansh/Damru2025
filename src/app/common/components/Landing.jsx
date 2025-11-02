'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import Pillars from './Pillars'
import Wheels from './Wheels'
import Platform from './Platform'
import { motion } from "motion/react";
const Landing = () => {
    const wheelRef = useRef(null);
    const platformContainerRef = useRef(null);
    const comingSoonRef = useRef(null);
    const [pillarsSettled, setPillarsSettled] = useState(false);
    const [templesSettled, setTemplesSettled] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const cloud1 = useRef(null);
    const cloud2 = useRef(null);
    const cloud3 = useRef(null);
    const cloud4 = useRef(null);
    const bg = useRef(null);
    const bg2 = useRef(null);
    const logoRef = useRef(null);
    const textRef = useRef(null);

    // Handle navbar button click and register button click (same animation)
    const handleNavClick = () => {
        if (!showComingSoon) {
            // Animate platform down and coming soon up
            const tl = gsap.timeline();
            tl.to(platformContainerRef.current, {
                y: window.innerHeight,
                duration: 0.8,
                ease: "power2.inOut"
            })
            .set(comingSoonRef.current, { zIndex: 100 }) // Ensure coming soon is on top
            .fromTo(comingSoonRef.current, 
                { y: window.innerHeight + 200 },
                { y: 0, duration: 0.8, ease: "power2.out" },
                "<"
            )
            .call(() => setShowComingSoon(true));
        }
    };

    // Handle register button click (same as navbar click)
    const handleRegisterClick = () => {
        handleNavClick(); // Reuse the same animation logic
    };

    // Handle back to home button click
    const handleBackToHome = () => {
        if (showComingSoon) {
            // Animate coming soon down and platform back up
            const tl = gsap.timeline();
            tl.to(comingSoonRef.current, {
                y: window.innerHeight + 200,
                duration: 0.8,
                ease: "power2.inOut"
            })
            .set(platformContainerRef.current, { zIndex: 20 }) // Reset platform z-index
            .fromTo(platformContainerRef.current,
                { y: window.innerHeight },
                { y: 0, duration: 0.8, ease: "power2.out" },
                "<"
            )
            .set(comingSoonRef.current, { zIndex: 10 }) // Move coming soon behind
            .call(() => setShowComingSoon(false));
        }
    };


    const handlePillarsSettled = useCallback(() => {
        setPillarsSettled(true);
    }, []);

    const handlePlatformSettled = useCallback(() => {
    }, []);

    const handleTemplesSettled = useCallback(() => {
        setTemplesSettled(true);
        const tl = gsap.timeline();
        tl.to(wheelRef.current, { opacity: 1, duration: 1 })
            .to(wheelRef.current.children[0], {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: "none"
            }, "<");
        gsap.fromTo(bg.current, { opacity: 0 }, {
            opacity: 1, duration: 1, onComplete: () => {
                gsap.to(bg2.current, {
                    opacity: 1, duration: 1, onComplete: () => {
                        gsap.to(cloud1.current, { opacity: 1, duration: 0.5 });
                        gsap.to(cloud2.current, { opacity: 1, duration: 0.5 });
                        gsap.to(cloud3.current, { opacity: 1, duration: 0.5 });
                        gsap.to(cloud4.current, {
                            opacity: 1, duration: 0.5, onComplete: () => {
                                gsap.to(cloud1.current, { y: -15, duration: 2.5, ease: "power1.inOut", yoyo: true, repeat: -1 });
                                gsap.to(cloud2.current, { y: -8, duration: 3, ease: "power1.inOut", yoyo: true, repeat: -1, delay: 0.5 });
                                gsap.to(cloud3.current, { y: -12, duration: 2.2, ease: "power1.inOut", yoyo: true, repeat: -1, delay: 1 });
                                gsap.to(cloud4.current, { y: -10, duration: 2.8, ease: "power1.inOut", yoyo: true, repeat: -1, delay: 1.5 });
                                gsap.fromTo(logoRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
                                gsap.fromTo(textRef.current, { opacity: 0, y: 50, zIndex: 10 }, { opacity: 1, y: 0, zIndex: 9999, duration: 1 });
                            }
                        });
                    }
                });
            }
        });
    }, []);

    return (
        <>
            <Image
                src='svg/Cloud1.svg'
                alt='Cloud 1'
                width={200}
                height={500}
                className='absolute left-[82%]  z-20 top-[10%] opacity-0'
                ref={cloud1}
            />
            <Image
                src='svg/Cloud2.svg'
                alt='Cloud 1'
                width={200}
                height={500}
                className='absolute left-[5%] z-20 top-[10%] opacity-0'
                ref={cloud2}
            />
            <Image
                src='svg/Cloud2.svg'
                alt='Cloud 1'
                width={200}
                height={500}
                className='absolute left-[14%] z-40  top-[50%] opacity-0'
                ref={cloud3}
            />

            <Image
                src='svg/Cloud2.svg'
                alt='Cloud 1'
                width={300}
                height={500}
                className='absolute left-[85%] z-20   top-[50%] opacity-0'
                ref={cloud4}
            />
            <div className='absolute flex justify-start -top-[6%] left-[5%] w-full z-0'>
                <Image
                    src='/png/Left.png'
                    alt='background'
                    width={500}
                    height={500}
                    className='opacity-0 scale-110'
                    ref={bg2}
                />
            </div>
            <div className='absolute flex justify-end w-full right-[5%] z-0'>
                <Image
                    src='/png/Right.png'
                    alt='background'
                    width={500}
                    height={500}
                    className='opacity-0 scale-110'
                    ref={bg}
                />
            </div>
            <div className='bg-[#f9e1d2] h-screen'>
                <div className='absolute flex flex-col items-center w-full top-[1%] gap-2 opacity-0' ref={logoRef}>
                    <Image
                        src='/svg/Logo.svg'
                        alt='Logo'
                        width={200}
                        height={50}
                    />
                    
                </div>
                <Pillars onPillarsSettled={handlePillarsSettled} />
                <Wheels templesSettled={templesSettled} />
                
                {/* Platform Container */}
                <div ref={platformContainerRef} className='relative'>
                    <div ref={wheelRef} className="flex justify-center w-full z-10 absolute bottom-0 opacity-0">
                        <Image
                            src="/svg/WheelBg.svg"
                            alt="Pillars"
                            width={0}
                            height={0}
                            className="h-auto w-[40%] opacity-100"
                            unoptimized={true}
                        />
                    </div>
                    <Platform 
                        pillarsSettled={pillarsSettled} 
                        onPlatformSettled={handlePlatformSettled} 
                        onTemplesSettled={handleTemplesSettled}
                        onNavClick={handleNavClick}
                        onRegisterClick={handleRegisterClick}
                    />
                </div>

                {/* Coming Soon Section - Initially positioned well below screen */}
                <div 
                    ref={comingSoonRef}
                    className='absolute top-0 left-0 w-screen h-screen z-10'
                    style={{ transform: `translateY(${typeof window !== 'undefined' ? window.innerHeight + 200 : 1200}px)` }}
                >
                    <Image 
                        src='/svg/ComingSoon.svg'
                        alt='Coming Soon'
                        width={0}
                        height={0}
                        className='h-auto w-[84%] bottom-0 absolute left-[8%]  z-10'
                        unoptimized={true}
                    />
                    <Image 
                        src='/svg/Logo.svg'
                        className='absolute z-20 left-[47%] top-[35%]'
                        alt='Logo'
                        width={100}
                        height={0}
                        unoptimized={true}
                    />
                    <h1 className='absolute z-20 left-1/2 transform -translate-x-1/2 top-[45%] text-5xl text-center'>Coming Soon</h1>
                    <p className='absolute z-20 left-1/2 transform -translate-x-1/2 top-[55%] text-3xl text-center'>We are actively working <br /> on it at this moment.</p>
                    <motion.button 
                        className='absolute left-[40%] w-[20%] z-30 top-[70%] p-3 rounded-2xl bg-[#CC0E3E] text-3xl cursor-pointer'
                        whileTap={{scale:0.9}}
                        onClick={handleBackToHome}
                    >
                        <h1 className='text-white'>Back to Home</h1>
                    </motion.button>
                </div>            </div>
            

        </>
    )
}


export default Landing