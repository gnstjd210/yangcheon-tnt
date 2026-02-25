"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ChannelIO?: (...args: any[]) => void;
        ChannelIOInitialized?: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        channelPluginSettings?: any;
    }
}

export default function ChannelTalkProvider() {
    const pathname = usePathname();

    useEffect(() => {
        // Admin 페이지에서는 채널톡을 띄우지 않음
        if (pathname?.startsWith("/admin")) {
            if (window.ChannelIO) {
                window.ChannelIO('hideBubble');
            }
            return;
        }

        const pluginKey = "87355b52-765d-400e-9735-4691741875ce";

        // Initialize ChannelIO
        (function () {
            const w = window;
            if (w.ChannelIO) {
                return w.console.error("ChannelIO script included twice.");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ch = function (...args: any[]) {
                ch.c(args);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                const s = document.createElement("script");
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

        // Boot ChannelIO
        if (window.ChannelIO) {
            window.ChannelIO('boot', {
                "pluginKey": pluginKey
            });
            window.ChannelIO('showBubble');
        }

        return () => {
            // Cleanup on unmount (if necessary, though ChannelIO usually persists per page)
        };
    }, [pathname]);

    return null;
}
