'use client'

import Landing from "./(Landing)/Landing";
import MobileLanding from "./(Landing)/MobileLanding";
import { useState, useEffect } from 'react';
import './globals.css';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {isMobile ? <MobileLanding /> : <Landing />}
    </>
  );
}
