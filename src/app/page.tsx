'use client'
import React, { useEffect } from 'react'
import Home from './Home/page'

const page = () => {

  useEffect(() => {
    const hideAddressBar = () => {
      window.scrollTo(0, 1);
    };
    setTimeout(hideAddressBar, 100);
    window.addEventListener('orientationchange', hideAddressBar);
    return () => {
      window.removeEventListener('orientationchange', hideAddressBar);
    };  
  }, []);

  return (
    <>
      <Home />
    </>
  )
}

export default page