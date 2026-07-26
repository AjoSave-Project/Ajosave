import React from 'react';

const PlayStoreButton = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = () => {
    // For now, we'll show an alert. Later this can be replaced with actual Play Store link
    alert('Coming soon to Google Play Store! Join our beta program to get early access.');
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2 ${sizeClasses[size]} ${className}`}
    >
      <svg className={iconSizes[size]} viewBox="0 0 24 24">
        {/* Left Triangle - Blue */}
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5Z" fill="#00C9FF" />

        {/* Bottom Triangle - Green */}
        <path d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z" fill="#00F076" />

        {/* Right Triangle - Yellow */}
        <path d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z" fill="#FFCC00" />

        {/* Top Triangle - Red */}
        <path d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="#F53349" />
      </svg>


      <div className="text-left">
        <div className={`text-gray-300 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          GET IT ON
        </div>
        <div className={`font-semibold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          Google Play
        </div>
      </div>
    </button>
  );
};

export default PlayStoreButton;