import React from 'react';

const AppStoreButton = ({ size = 'md', className = '' }) => {
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
    // For now, we'll show an alert. Later this can be replaced with actual App Store link
    alert('Coming soon to the App Store! Join our beta program to get early access.');
  };

  return (
    <button 
      onClick={handleClick}
      className={`bg-black text-white rounded-lg font-medium transition-colors flex items-center space-x-2 opacity-50 cursor-not-allowed ${sizeClasses[size]} ${className}`}
      disabled
    >
      <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
      </svg>
      <div className="text-left">
        <div className={`text-gray-400 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          GET IT ON
        </div>
        <div className={`font-semibold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          App Store
        </div>
      </div>
    </button>
  );
};

export default AppStoreButton;