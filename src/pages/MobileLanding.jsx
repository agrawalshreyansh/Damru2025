'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from "motion/react";
import { gsap } from 'gsap';
import getTimeLeft from '../app/common/utils/getTimeLeft.js';
import NavButton from '@/app/common/components/NavButton.jsx';


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
        <div 
            className='fixed inset-0 bg-[#f9e1d2] w-full h-full overflow-hidden'
            style={{ 
                touchAction: 'none', 
                overscrollBehavior: 'none',
                WebkitOverflowScrolling: 'touch'
            }}
        >

            <Image  
                ref={logoRef}
                src='/svg/Logo.svg'
                width={0}
                height={0}
                alt='Damru Logo'
                className='absolute top-10 left-50 h-auto w-[40%] z-50 transform -translate-x-1/2'
                unoptimized={true}
            />

            <Image 
                ref={leftImageRef}
                src='/svg/Left.svg'  
                width={0} 
                height={0} 
                alt='Left Decoration' 
                className='absolute -left-65 top-30 h-auto w-full z-0' 
                unoptimized={true}
            />
            <Image 
                ref={rightImageRef}
                src='/svg/Right.svg' 
                width={0} 
                height={0} 
                alt='Right Decoration' 
                className='absolute -right-65 top-30 h-auto w-full z-0' 
                unoptimized={true}
            />
            
            <Image
                ref={cloud1Ref}
                src='/svg/Cloud2.svg'
                width={0}
                height={0}
                alt='Cloud Left'
                className='absolute -left-15 top-40 h-auto w-[50%] z-40'
                unoptimized={true}
            />

            <Image
                ref={cloud2Ref}
                src='/svg/Cloud2.svg'
                width={0}
                height={0}
                alt='Cloud Right'
                className='absolute -right-20 top-10 h-auto w-[50%] z-40'
                unoptimized={true}
            />

             <div className='flex gap-4 absolute w-full top-100 text-white h-full z-20'>
                <NavButton
                    name="Events"
                    className="left-[18%] bottom-[2%]"
                    ref={Nav1}
                    textClassName="right-[2%] bottom-30"
            
                />
                            <NavButton
                                name="Competitions"
                                className="-bottom-[2%] left-[15%]"
                                ref={Nav4}
                           
                            />
                            <NavButton
                                name="Contact"
                                className="left-[10%] bottom-[2%]"
                                ref={Nav2}
                                textClassName="right-[4%]"
                              
                            />
                            <NavButton
                                name="About Damru"
                                className="-bottom-[10%] right-[8%]"
                                ref={Nav3}
                            
                            />
                        </div>
              
        
            <div className='absolute bottom-0 w-full max-h-screen'>
                <Image
                    ref={platformRef}
                    src="/png/MobilePlatform.png"
                    alt="Platform"
                    width={0}
                    height={0}
                    className="w-full absolute bottom-0 z-10"
                    unoptimized={true}
                />

            
                
                

                <div className='absolute bottom-4 w-full flex flex-col items-center'>
                    <div 
                        ref={registerButtonRef}
                        className="flex justify-center w-full z-20 mb-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.0 }}
                            whileTap={{ scale: 0.9 }}
                            className='w-[85%] bg-[#CC0E3E] cursor-pointer rounded-full p-3 px-4'>
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
                    </div>
                    <div 
                        ref={timerRef}
                        className='flex flex-col items-center gap-2 pb-2 z-20'
                    >
                        <div className='flex justify-center gap-20'>
                            <div className='w-[15%] flex flex-col justify-center items-center'>
                                <h1 className='text-white text-7xl'>{String(timeLeft.days).padStart(2, '0')}</h1>
                                <h1 className='text-white text-3xl -mt-1'>Days</h1>
                            </div>
                            <div className='w-[15%] flex flex-col justify-center items-center'>
                                <h1 className='text-white text-7xl'>{String(timeLeft.hours).padStart(2, '0')}</h1>
                                <h1 className='text-white text-3xl -mt-1'>Hours</h1>
                            </div>
                        </div>
                        <div className='flex justify-center gap-20'>
                            <div className='w-[15%] flex flex-col justify-center items-center'>
                                <h1 className='text-white text-7xl'>{String(timeLeft.minutes).padStart(2, '0')}</h1>
                                <h1 className='text-white text-3xl -mt-1'>Minutes</h1>
                            </div>
                            <div className='w-[15%] flex flex-col justify-center items-center'>
                                <h1 className='text-white text-7xl'>{String(timeLeft.seconds).padStart(2, '0')}</h1>
                                <h1 className='text-white text-3xl -mt-1'>Seconds</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full absolute bottom-38 z-5 scale-112">
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
    )
}

export default MobileLanding