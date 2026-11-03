import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackText,
  fallbackSrc,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initial = (fallbackText || alt || 'SPACE').slice(0, 10).toUpperCase();

  if (hasError) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          loading="lazy"
          className={`object-cover object-center ${className}`}
          {...props}
        />
      );
    }

    return (
      <div 
        className={`bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-wider select-none p-4 ${className}`}
      >
        <span className="text-[10px] text-zinc-400 font-bold mb-1">{initial}</span>
        <span className="text-[9px] text-zinc-600">HIGH-RES TELEMETRY</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      onLoad={() => setIsLoading(false)}
      className={`object-cover object-center transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'} ${className}`}
      {...props}
    />
  );
};
