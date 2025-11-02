import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

const Wheels = ({ templesSettled }) => {
    const leftWheelRef = useRef(null);
    const rightWheelRef = useRef(null);

    useEffect(() => {
        if (templesSettled) {
            gsap.to(leftWheelRef.current, {
                opacity: 1, duration: 1});
            gsap.to(rightWheelRef.current, {
                opacity: 1, duration: 1,});
        }
    }, [templesSettled]);

    return (
        <>
            <div ref={leftWheelRef} className="flex w-full z-10 absolute -bottom-[5%] -left-[2%] opacity-0">
                <Image
                    src="/svg/LeftGrass.svg"
                    alt="RightGrass"
                    width={0}
                    height={0}
                    className="h-auto w-[30%]"
                    unoptimized={true}
                />
            </div>
            <div ref={rightWheelRef} className="flex justify-end w-full z-10 absolute  -bottom-[2%] opacity-0">
                <Image
                    src="/svg/RightGrass.svg"
                    alt="RightGrass"
                    width={0}
                    height={0}
                    className="h-auto w-[50%]"
                    unoptimized={true}
                />
            </div>
        </>
    )
}

export default Wheels