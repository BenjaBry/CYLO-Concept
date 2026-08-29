import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: isPointer ? '40px' : '20px',
        height: isPointer ? '40px' : '20px',
        backgroundColor: isPointer ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.8)',
        border: isPointer ? '1px solid rgba(0,0,0,0.5)' : 'none',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translate(${position.x - (isPointer ? 20 : 10)}px, ${position.y - (isPointer ? 20 : 10)}px)`,
        transition: 'width 0.2s, height 0.2s, background-color 0.2s, transform 0.05s linear',
        zIndex: 9999,
        mixBlendMode: 'difference' // Better for dark/light contrast
      }}
    />
  );
}
