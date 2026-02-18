import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    handler: Handler,
    ignoreRefs?: RefObject<HTMLElement | null>[]
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref.current;
            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            // Ignore clicks on specific elements (like the toggle button)
            if (ignoreRefs) {
                for (const ignoreRef of ignoreRefs) {
                    if (ignoreRef.current && ignoreRef.current.contains(event.target as Node)) {
                        return;
                    }
                }
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, ignoreRefs]);
}
