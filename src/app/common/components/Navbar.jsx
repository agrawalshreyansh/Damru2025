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
        <div className='absolute z-25 text-white w-[60%] h-[50%] lg:h-[60%] xl:h-[90%]' style={{ display }}>
            <div className='flex gap-4 relative w-full h-full z-20'>
                <NavButton
                    name="Events"
                    className="left-[16%] bottom-[20%] "
                    ref={Nav1}
                    textClassName="right-[2%]"
                    onClick={onNavClick}
                />
                <NavButton
                    name="Competitions"
                    className="bottom-[6%] left-[14%]"
                    ref={Nav4}
                    onClick={onNavClick}
                />
                <NavButton
                    name="Contact"
                    className="left-[10%] bottom-[22%]"
                    ref={Nav2}
                    textClassName="right-[4%]"
                    onClick={onNavClick}
                />
                <NavButton
                    name="About Damru"
                    className="bottom-[10%] right-[8%]"
                    ref={Nav3}
                    onClick={onNavClick}
                />
            </div>
        </div>
    );
};

export default Navbar;