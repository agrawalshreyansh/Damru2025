import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

const Pillars = ({ onPillarsSettled }) => {
    const leftPillarRef = useRef(null);
    const rightPillarRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(leftPillarRef.current, { x: -window.innerWidth, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: "power2.out" });
        gsap.fromTo(rightPillarRef.current, { x: window.innerWidth, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: "power2.out", onComplete: () => onPillarsSettled && onPillarsSettled() });
    }, [onPillarsSettled]);

    return (
        <div className='absolute w-full z-20 h-screen'>
            <div className='flex justify-between'>
                <Image
                    ref={leftPillarRef}
                    src="/png/PillarLeft.png"
                    alt="Pillars"
                    width={0}
                    height={0}
                    className="h-screen w-auto opacity-0"
                    unoptimized={true}
                />
                <Image
                    ref={rightPillarRef}
                    src="/png/PillarRight.png"
                    alt="Pillars"
                    width={0}
                    height={0}
                    className="h-screen w-auto opacity-0"
                    unoptimized={true}
                />
            </div>
        </div>
    )
}

export default Pillars