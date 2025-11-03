'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from "motion/react";
import { gsap } from 'gsap';
import getTimeLeft from '@/app/common/utils/getTimeLeft.js';


const MobileLanding = () => {
    const wheelRef = useRef(null);
    const registerTextRef = useRef(null);
    const platformRef = useRef(null);
    const logoRef = useRef(null);
    const titleRef = useRef(null);
    const leftImageRef = useRef(null);
    const rightImageRef = useRef(null);
    const cloud1Ref = useRef(null);
    const cloud2Ref = useRef(null);
    const timerRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const registerButtonRef = useRef(null);

    const Nav1 = useRef(null);
    const Nav2 = useRef(null);
    const Nav3 = useRef(null);
    const Nav4 = useRef(null);
    var [display,setDisplay] = useState('none');
    
    
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    useEffect(() => {
        // Initialize animation function that waits for all refs
        const initializeAnimation = () => {
            // Check if all refs are available
            const allRefs = [
                logoRef.current,
                platformRef.current,
                Nav1.current, Nav2.current, Nav3.current, Nav4.current,
                leftImageRef.current, rightImageRef.current,
                cloud1Ref.current, cloud2Ref.current,
                wheelRef.current, registerTextRef.current, timerRef.current,
                registerButtonRef.current
            ];

            if (!allRefs.every(ref => ref !== null)) {
                // If any ref is not ready, wait a bit and try again
                setTimeout(initializeAnimation, 100);
                return;
            }

            console.log('All refs ready, starting animations');

            // Set initial states (hidden)
            gsap.set([logoRef.current], { opacity: 0, y: -30 });
            gsap.set([platformRef.current], { y: 100, opacity: 0 });
            gsap.set([Nav1.current, Nav2.current, Nav3.current, Nav4.current], { 
                opacity: 0, 
                rotationX: -90, 
                y: 20 
            });
            gsap.set([leftImageRef.current, rightImageRef.current], { opacity: 0 });
            gsap.set([cloud1Ref.current, cloud2Ref.current], { opacity: 0, y: 20 });
            gsap.set(wheelRef.current, { opacity: 0 });
            gsap.set(timerRef.current, { opacity: 0, y: 30 });
            gsap.set(registerButtonRef.current, { opacity: 0, y: 20, scale: 0.8 });

            // Create main animation timeline
            const tl = gsap.timeline({ delay: 0.5 });

            // 1. Logo fades in first
            tl.to([logoRef.current], {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            })
            // 2. Platform slides up from bottom
            .to(platformRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, "-=0.5")
            // 3. Nav buttons flip in one by one
            .to([Nav1.current, Nav2.current, Nav3.current, Nav4.current], {
                opacity: 1,
                rotationX: 0,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                stagger: 0.2
            }, "-=0.5")
            // 4. Register button appears with bounce effect
            .to(registerButtonRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.3")
            // 5. Timer fades in after platform setup
            .to(timerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.4")
            // 6. Left and right images fade in
            .to([leftImageRef.current, rightImageRef.current], {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.3")
            // 7. Clouds fade in
            .to([cloud1Ref.current, cloud2Ref.current], {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.5")
            // 8. Wheel fades in
            .to(wheelRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.4")
            // 9. Start continuous animations
            .call(() => {
                // Register button text animation
                if (registerTextRef.current) {
                    gsap.to(registerTextRef.current.children, { 
                        filter: 'blur(0px)', 
                        duration: 0.8, 
                        ease: "power2.out", 
                        stagger: 0.1 
                    });
                }
                
                // Wheel continuous rotation
                gsap.to(wheelRef.current, { 
                    rotation: 360, 
                    duration: 20, 
                    repeat: -1, 
                    ease: "none" 
                });
                
                // Cloud floating animations
                gsap.to(cloud1Ref.current, { 
                    y: -15, 
                    duration: 3, 
                    ease: "power1.inOut", 
                    yoyo: true, 
                    repeat: -1 
                });
                gsap.to(cloud2Ref.current, { 
                    y: -10, 
                    duration: 2.5, 
                    ease: "power1.inOut", 
                    yoyo: true, 
                    repeat: -1,
                    delay: 1 
                });
            });
        };

        // Start initialization
        initializeAnimation();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Prevent body scroll on component mount
    useEffect(() => {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
            document.body.style.height = 'unset';
        };
    }, []);


    return (
        <>
            <div 
                className='fixed inset-0 bg-[#f9e1d2] w-full h-full overflow-hidden'
                style={{ 
                    touchAction: 'none', 
                    overscrollBehavior: 'none',
                    WebkitOverflowScrolling: 'touch',
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh'
                }}
            >
            <div className='absolute h-[60vh] w-full'>
                <Image  
                    ref={logoRef}
                    src='/svg/Logo.svg'
                    width={0}
                    height={0}
                    alt='Damru Logo'
                    className='absolute z-50 h-auto w-[40%]'
                    style={{
                        top: '5vh',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                    unoptimized={true}
                />

                <Image 
                    ref={leftImageRef}
                    src='/svg/Left.svg'  
                    width={0} 
                    height={0} 
                    alt='Left Decoration' 
                    className='absolute h-auto w-full z-0'
                    style={{
                        left: '-65%',
                        top: '20vh'
                    }}
                    unoptimized={true}
                />
                <Image 
                    ref={rightImageRef}
                    src='/svg/Right.svg' 
                    width={0} 
                    height={0} 
                    alt='Right Decoration' 
                    className='absolute h-auto w-full z-0'
                    style={{
                        right: '-65%',
                        top: '20vh'
                    }}
                    unoptimized={true}
                />
                
                <Image
                    ref={cloud1Ref}
                    src='/svg/Cloud2.svg'
                    width={0}
                    height={0}
                    alt='Cloud Left'
                    className='absolute h-auto w-[50%] z-40'
                    style={{
                        left: '-15%',
                        top: '20vh'
                    }}
                    unoptimized={true}
                />

                <Image
                    ref={cloud2Ref}
                    src='/svg/Cloud2.svg'
                    width={0}
                    height={0}
                    alt='Cloud Right'
                    className='absolute h-auto w-[50%] z-40'
                    style={{
                        right: '-20%',
                        top: '10vh'
                    }}
                    unoptimized={true}
                />
                
            </div>
            

            

            <div className='fixed bottom-0 left-0 w-full flex-col justify-end content-baseline items-end z-10'  style={{ height: '40vh' }}>


                <div className='absolute w-full h-full top-0 flex bottom-0 flex-col justify-end'>
                    <div className="relative bottom-[30%] w-full">
                        <Image
                            ref={platformRef}
                            src="/png/TemplesP.png"
                            alt="Platform"
                            width={0}
                            height={0}
                            className="w-full relative z-10"
                            unoptimized={true}
                        />

                        <motion.button 
                        onClick={() => setDisplay('flex')}
                        whileTap={{scale:0.9}}
                        className="relative paradose w-[30%] h-auto  items-center z-10 text-white font-WsParadose text-lg " style={{left: '13%',bottom:'70%',
                            backgroundImage: "url('/svg/NavBg.svg')",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"

                        }} ref={Nav1}>
                            Events
                
                        </motion.button>
                    
            
                        {/* Contact - Top Right */}
                        <motion.button 
                        onClick={() => setDisplay('flex')}
                        whileTap={{scale:0.9}}
                        className="relative paradose w-[30%] h-auto z-10 text-white font-WsParadose text-lg items-center text-center" style={{left: '29%',bottom: '70%',
                            backgroundImage: "url('/svg/NavBg.svg')",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"

                        }} ref={Nav2}>
                            
                                Contact
                            
                        </motion.button>

                        {/* Competitions - Center Middle */}
                        <motion.button 
                        onClick={() => setDisplay('flex')}
                        whileTap={{scale:0.9}}
                        className="paradose w-[40%] p-1 h-auto relative z-10 text-white font-WsParadose text-lg items-center text-center" style={{left: '0',bottom: '40%',
                            backgroundImage: "url('/svg/NavBg.svg')",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"

                        }} ref={Nav3}>
                            About Damru
                
                        </motion.button>

                        {/* About Damru - Bottom Right */}
                    
                        <motion.button 
                        onClick={() => setDisplay('flex')}
                        whileTap={{scale:0.9}}
                        className="relative paradose w-[40%] p-1  h-auto z-10 text-white text-center font-WsParadose text-lg " style={{left: '32%',bottom: '60%',
                            backgroundImage: "url('/svg/NavBg.svg')",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"

                        }} ref={Nav4}>
                    
                                Competitions
                        
                        </motion.button>
            

                    </div>
                    

                    <div className='absolute w-full h-[30vh] bottom-0 z-20'
                    style={
                        {
                            backgroundImage: "url('svg/TemplesDown.svg')",

                        }
                    }
                    >
                        <div 
                                className='relative w-full flex  flex-col items-center'
                                style={{ 
                                    bottom: '10%', // Position relative to platform image height
                                    left: 0,
                                    right: 0
                                }}
                            >
                            <div 
                                ref={registerButtonRef}
                                className="flex justify-center w-full z-10"
                                style={{ marginBottom: '0' }}
                            >
                                <motion.button 
                                onClick={()=>setDisplay('flex')}
                                    whileHover={{ scale: 1.0 }}
                                    whileTap={{ scale: 0.9 }}
                                    className='w-[70vw] h-[7vh] bg-[#CC0E3E] cursor-pointer items-center text-center justify-center flex flex-col rounded-full p-3 px-4'>
                                    <h1 ref={registerTextRef} className='text-2xl text-white kamal'>
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
                            </div>
                            <div 
                                ref={timerRef}
                                className='flex flex-col items-center gap-2 pb-2 z-20'
                            >
                                <div className='flex justify-center gap-20'>
                                    <div className='w-[15%] flex flex-col justify-center items-center'>
                                        <h1 className='text-white text-6xl'>{String(timeLeft.days).padStart(2, '0')}</h1>
                                        <h1 className='text-white text-3xl -mt-1'>Days</h1>
                                    </div>
                                    <div className='w-[15%] flex flex-col justify-center items-center'>
                                        <h1 className='text-white text-6xl'>{String(timeLeft.hours).padStart(2, '0')}</h1>
                                        <h1 className='text-white text-3xl -mt-1'>Hours</h1>
                                    </div>
                                </div>
                                <div className='flex justify-center gap-20'>
                                    <div className='w-[15%] flex flex-col justify-center items-center'>
                                        <h1 className='text-white text-6xl'>{String(timeLeft.minutes).padStart(2, '0')}</h1>
                                        <h1 className='text-white text-2xl -mt-1'>Minutes</h1>
                                    </div>
                                    <div className='w-[15%] flex flex-col justify-center items-center'>
                                        <h1 className='text-white text-6xl'>{String(timeLeft.seconds).padStart(2, '0')}</h1>
                                        <h1 className='text-white text-2xl -mt-1'>Seconds</h1>
                                    </div>
                                </div>
                            </div>
                        </div> 


                
                    </div>
                    <div 
                        className="flex justify-center w-full absolute z-5"
                        style={{ 
                            bottom: '20vh',
                            transform: 'scale(1.12)'
                        }}
                    >
                        <Image
                            ref={wheelRef}
                            src="/svg/WheelBg.svg"
                            alt="Wheel"
                            width={0}
                            height={0}
                            className="h-auto w-full opacity-100"
                            unoptimized={true}
                        />
                    </div> 
                    
                    
                </div>
            </div>

            </div>

            <div className='w-screen absolute h-screen z-30 flex gap-2 justify-center items-center content-center flex-col bg-black'
            style={
                {
                    display: display,
                    backgroundSize: "cover",
                    backgroundImage: "url('png/ComingSoon.png')",
                    backgroundPosition: "contain",
                    backgroundRepeat: "no-repeat",
                }
            }
            >
                <Image 
                src='/svg/Logo.svg'
                width={0}
                height={0}
                className='w-[20vh] relative top-[10%]'
                alt='Logo'
                />

                <h1 className='text-5xl relative top-[10%]'>Coming Soon</h1>
                <p className='text-2xl text-center relative top-[10%]'>We’re actively working on it at this moment.</p>

                <motion.button 
                whileTap={{scale:0.9}}
                onClick={() => setDisplay('none')}
                className='text-white text-2xl bg-[#CC0E3E] p-4 relative top-[20%] w-[50vw] rounded-2xl'>
                    Back to Home

                </motion.button>

            </div>
        </>
    )
}

export default MobileLanding