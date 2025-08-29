import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, Facebook } from 'lucide-react';

export default function FloatingActions() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // WhatsApp number (replace with your actual number)
  const whatsappNumber = '+237677246624';
  const whatsappMessage = 'Hello! I need information about your bus services.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Facebook page URL (replace with your actual page)
  const facebookUrl = 'https://www.facebook.com/globalbush';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  const openFacebook = () => {
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
      {/* WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          💬
        </span>
      </button>

      {/* Scroll to Top Button with Progress */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative group"
          aria-label="Scroll to top"
        >
          {/* Progress Circle */}
          <svg className="w-14 h-14 transform -rotate-90 absolute inset-0">
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="text-blue-200 opacity-50"
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="text-white"
              strokeDasharray={163.36} // 2 * π * 26
              strokeDashoffset={163.36 - (scrollProgress / 100) * 163.36}
            />
          </svg>
          
          <ArrowUp className="w-6 h-6 relative" />
          
          {/* Tooltip */}
          <span className="absolute -top-10 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Scroll to top ({Math.round(scrollProgress)}%)
          </span>
        </button>
      )}

      {/* Facebook Button */}
      <button
        onClick={openFacebook}
        className="w-14 h-14 bg-blue-800 hover:bg-blue-900 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Visit our Facebook page"
      >
        <Facebook className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-white text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          👍
        </span>
      </button>

      {/* Mobile consideration - stack vertically on small screens */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fixed {
            bottom: 4rem;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};