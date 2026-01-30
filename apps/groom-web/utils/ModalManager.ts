import { signal } from "@preact-signals/safe-react";
import type { ReactNode } from "react";

// biome-ignore lint/complexity/noStaticOnlyClass: we want a static class here
class ModalManager {
  static isVisible = signal(false);
  static content = signal<ReactNode | null>(null);

  static open(node: ReactNode) {
    ModalManager.content.value = node;
    ModalManager.isVisible.value = true;
  }

  static close() {
    ModalManager.isVisible.value = false;
    ModalManager.content.value = null;
  }

  static isOpen() {
    return ModalManager.isVisible.peek();
  }
}

export default ModalManager;
