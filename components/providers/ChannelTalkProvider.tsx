"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ChannelIO?: (...args: any[]) => void;
        ChannelIOInitialized?: boolean;
    }
}

export default function ChannelTalkProvider() {
    const pathname = usePathname();
    const isChannelLoaded = useRef(false);

    useEffect(() => {
        // Prevent execution globally in React Strict mode twice
        if (isChannelLoaded.current) return;

        isChannelLoaded.current = true;
        const pluginKey = "67395b52-765d-406a-9795-469174f873ce";

        if (pathname?.startsWith("/admin")) {
            if (window.ChannelIO) {
                window.ChannelIO('hideBubble');
            }
            return;
        }

        // Only inject if window.ChannelIO does not exist
        if (!window.ChannelIO) {
            (function () {
                const w = window;
                if (w.ChannelIO) {
                    return; // Additional safety net
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ch = function (...args: any[]) {
                    ch.c(args);
                } as any;

                ch.q = [] as any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ch.c = function (args: any) {
                    ch.q.push(args);
                };
                w.ChannelIO = ch;

                function l() {
                    if (w.ChannelIOInitialized) {
                        return;
                    }
                    w.ChannelIOInitialized = true;
                    // Double check by DOM id
                    if (document.getElementById("ch-plugin-script")) {
                        return;
                    }

                    const s = document.createElement("script");
                    s.id = "ch-plugin-script";
                    s.type = "text/javascript";
                    s.async = true;
                    s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
                    const x = document.getElementsByTagName("script")[0];
                    if (x && x.parentNode) {
                        x.parentNode.insertBefore(s, x);
                    }
                }

                if (document.readyState === "complete") {
                    l();
                } else {
                    w.addEventListener("DOMContentLoaded", l);
                    w.addEventListener("load", l);
                }
            })();
        }

        // Boot ChannelIO
        if (window.ChannelIO) {
            window.ChannelIO('boot', {
                "pluginKey": pluginKey
            });
            window.ChannelIO('showBubble');
        }

    }, [pathname]);

    return null;
}
