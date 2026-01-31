import type { ReactNode } from "react";

// biome-ignore lint/complexity/noStaticOnlyClass: we want a static class here
class ModalManager {
  private static isVisible = false;
  private static content: ReactNode | null = null;

  static open(node: ReactNode) {
    ModalManager.content = node;
    ModalManager.isVisible = true;
  }

  static close() {
    ModalManager.isVisible = false;
    ModalManager.content = null;
  }

  static isOpen() {
    return ModalManager.isVisible;
  }
}

export default ModalManager;
