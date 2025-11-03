import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import Timer from './Timer';
import Navbar from './Navbar';

const Platform = ({ pillarsSettled, onPlatformSettled, onTemplesSettled, onNavClick, onRegisterClick }) => {
    const platformRef = useRef(null);
    const temple1Ref = useRef(null);
    const temple2Ref = useRef(null);
    const temple3Ref = useRef(null);
    const temple4Ref = useRef(null);
    const [Display, setDisplay] = useState('none');
    const [animateTimer, setAnimateTimer] = useState(false);


    useEffect(() => {
        if (pillarsSettled) {
            gsap.fromTo(platformRef.current, { y: window.innerHeight, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: "power2.out", onComplete: () => {
                    onPlatformSettled && onPlatformSettled();
                    setDisplay('block');
                    setAnimateTimer(true);
                    onTemplesSettled && onTemplesSettled();
                }
            });
        }

    }, [pillarsSettled, onPlatformSettled, onTemplesSettled]);

    return (
        <div ref={platformRef} className='flex justify-center relative items-end h-screen z-20 platform-container'>
            <div className='flex flex-col relative justify-center items-center w-full bg-blue bottom-0 h-full'>
                <Image
                    src="/svg/Temples.svg"
                    alt="Platform"
                    width={0}
                    height={0}
                    className="w-[65%] z-10 absolute bottom-0"
                    unoptimized={true}
                />
                <Navbar display={Display} onNavClick={onNavClick} />
                <div className='absolute z-30 w-[65%] bottom-0 flex justify-center'>
                    <Timer animateText={animateTimer} onRegisterClick={onRegisterClick} />
                </div>
            </div>
        </div>
    )
}

export default Platform