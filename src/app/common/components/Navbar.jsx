import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import NavButton from './NavButton';

const Navbar = ({ display, onNavClick }) => {
    const Nav1 = useRef(null);
    const Nav2 = useRef(null);
    const Nav3 = useRef(null);
    const Nav4 = useRef(null);

    useEffect(() => {
        if (display === 'block') {
            const tl = gsap.timeline();
            gsap.set([Nav1.current, Nav2.current, Nav3.current, Nav4.current], {
                opacity: 0
            });
            tl.to(Nav1.current, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            })
            .to(Nav2.current, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to(Nav3.current, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to(Nav4.current, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3");
        }
    }, [display]);

    return (
        <div className='absolute z-20 w-[65%] bottom-0 overflow-hidden' style={{ display, aspectRatio: '16/9' }}>
            <NavButton
                name="Events"
                className="left-[22%] top-[6%] w-[clamp(80px,18%,200px)]"
                ref={Nav1}
                textClassName="right-[2%] text-[clamp(0.6rem,1.4vw,1.6rem)]"
                onClick={onNavClick}
            />
            <NavButton
                name="Competitions" 
                className="left-[40%] top-[24%] w-[clamp(90px,22%,240px)]"
                ref={Nav4}
                onClick={onNavClick}
                textClassName=" text-[clamp(1rem,1.8vw,2rem)]"
            />
            <NavButton
                name="Contact"
                className="right-[18%] top-2 w-[clamp(80px,18%,200px)]"
                ref={Nav2}
                textClassName="text-[clamp(0.8rem,1.6vw,1.8rem)]"
                onClick={onNavClick}
            />
            <NavButton
                name="About Damru"
                className="top-[20%] right-[12%] w-[clamp(80px,18%,200px)]"
                ref={Nav3}
                onClick={onNavClick}
                textClassName="text-[clamp(0.6rem,1.4vw,1.6rem)]"
            />
        </div>
    );
};

export default Navbar;