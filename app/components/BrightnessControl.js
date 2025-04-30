'use client';

import { useState, useEffect } from 'react';

export default function BrightnessControl() {
  const [opacity, setOpacity] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('brightnessPreference') || '0.1');
    }
    return 0.1;
  });

  useEffect(() => {
    localStorage.setItem('brightnessPreference', opacity.toString());
    
    // Update overlay
    const overlay = document.querySelector('.brightness-overlay');
    if (overlay) {
      overlay.style.opacity = opacity;
    }

    // Update text colors
    const navItems = document.querySelectorAll('.nav-text');
    navItems.forEach(item => {
      // Interpolate between white and black based on opacity
      const colorValue = Math.round(255 * (1 - opacity));
      const textColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
      item.style.color = textColor;
      item.style.transition = 'color 300ms ease';
    });
  }, [opacity]);

  return (
    <input
      type="range"
      min="10"
      max="80"
      value={opacity * 100}
      onChange={(e) => setOpacity(e.target.value / 100)}
      className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.7))'
      }}
    />
  );
} 