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
                className="left-[22%]"
                ref={Nav1}
                textClassName="right-[2%]"
                onClick={onNavClick}
            />
            <NavButton
                name="Competitions"
                className="left-[42%] top-[26%]"
                ref={Nav4}
                onClick={onNavClick}
            />
            <NavButton
                name="Contact"
                className="right-[20%]"
                ref={Nav2}
                textClassName="right-[4%]"
                onClick={onNavClick}
            />
            <NavButton
                name="About Damru"
                className="top-[20%] right-[12%]"
                ref={Nav3}
                onClick={onNavClick}
            />
        </div>
    );
};

export default Navbar;