"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        ChannelIO?: (...args: any[]) => void;
        ChannelIOInitialized?: boolean;
    }
}

export default function ChannelTalkProvider() {
    const pathname = usePathname();

    useEffect(() => {
        // Use the env key, fallback to string if env is missing in local
        const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY || "67395b52-765d-406a-9795-469174f873ce";

        if (!pluginKey) return;

        // 1. Official Channel.io Script installation
        (function () {
            const w = window;
            if (w.ChannelIO) {
                return;
            }
            const ch = function (...args: any[]) {
                (ch as any).c(args);
            } as any;
            ch.q = [];
            ch.c = function (args: any) {
                ch.q.push(args);
            };
            w.ChannelIO = ch;
            function l() {
                if (w.ChannelIOInitialized) { return; }
                w.ChannelIOInitialized = true;
                const s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
                const x = document.getElementsByTagName("script")[0];
                if (x && x.parentNode) {
                    x.parentNode.insertBefore(s, x);
                } else {
                    document.head.appendChild(s);
                }
            }
            if (document.readyState === "complete") {
                l();
            } else {
                window.addEventListener("DOMContentLoaded", l);
                window.addEventListener("load", l);
            }
        })();

        // Admin pages: Hide the generic floating bubble
        if (pathname?.startsWith("/admin")) {
            window.ChannelIO?.('hideBubble');
            return;
        }

        // 2. Explicitly boot Channel.io layout
        window.ChannelIO?.('boot', {
            "pluginKey": pluginKey
        });

        // Always show the bubble if not admin
        window.ChannelIO?.('showBubble');

    }, [pathname]);

    return null;
}
