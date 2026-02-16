"use client";

import Image from "next/image";
import type { FC } from "react";
import { useState, useMemo } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

const FALLBACK_IMAGE = "/images/logo.png";

const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
  
  // Check if it's a local path (starts with /)
  if (url.startsWith("/")) return true;
  
  // Check if it's a valid URL
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const AppImage: FC<Props> = ({
  src,
  alt,
  width = 800,
  height = 450,
  className = "w-full h-auto object-cover rounded",
}) => {
  const [hasError, setHasError] = useState(false);

  const imageSrc = useMemo(() => {
    // If error occurred, use fallback
    if (hasError) return FALLBACK_IMAGE;
    
    // If src is invalid, use fallback immediately
    if (!isValidImageUrl(src)) return FALLBACK_IMAGE;
    
    return src;
  }, [src, hasError]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  return (
    <Image
      src={imageSrc}
      width={width}
      height={height}
      alt={alt}
      loading="lazy"
      className={className}
      onError={handleError}
    />
  );
};

export default AppImage;
