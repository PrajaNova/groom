declare namespace JSX {
  interface IntrinsicElements {
    "lottie-player": {
      src?: string;
      background?: string;
      speed?: number | string;
      style?: Record<string, string>;
      class?: string;
      autoplay?: boolean;
      loop?: boolean;
    };
  }
}
