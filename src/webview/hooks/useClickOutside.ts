import { useEffect, RefObject } from 'react';

export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener, false);
    document.addEventListener('touchstart', listener, false);

    return () => {
      document.removeEventListener('mousedown', listener, false);
      document.removeEventListener('touchstart', listener, false);
    };
  }, [ref, handler, enabled]);
}
