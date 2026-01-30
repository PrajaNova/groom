"use client";

import Image from "next/image";
import type { FC } from "react";
import { useMemo } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

const AppImage: FC<Props> = ({
  src,
  alt,
  width = 800,
  height = 450,
  className = "w-full h-auto object-cover rounded",
}) => {
  const imageSrc = useMemo(() => {
    if (!src) return "";
    return src;
  }, [src]);

  const onError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = `https://picsum.photos/seed/i123123/600/400`;
  };

  return (
    <Image
      src={imageSrc}
      width={width}
      height={height}
      alt={alt}
      loading="lazy"
      className={className}
      onError={onError}
    />
  );
};

export default AppImage;
