/** biome-ignore-all lint/correctness/noUnusedVariables: false positive */
/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */

interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set",
    targetId: string,
    config?: Record<string, any>,
  ) => void;
  dataLayer: any[];
}
