"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
    interface Window {
        ChannelIO?: (...args: any[]) => void;
        ChannelIOInitialized?: boolean;
    }
}

export default function ChannelTalkProvider() {
    const pathname = usePathname();
    const isBooted = useRef(false);

    useEffect(() => {
        const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY;

        if (!pluginKey) {
            console.error("🚨 [ChannelTalk Error] NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY is missing or undefined! Please check your Vercel Environment Variables or local .env file.");
            return;
        }

        // Initialize stub if it doesn't exist
        if (typeof window !== "undefined" && !window.ChannelIO) {
            const ch = function (...args: any[]) {
                ch.c(args);
            } as any;
            ch.q = [] as any[];
            ch.c = function (args: any) {
                ch.q.push(args);
            };
            window.ChannelIO = ch;
        }

        if (pathname?.startsWith("/admin")) {
            if (window.ChannelIO) {
                window.ChannelIO('hideBubble');
            }
            return;
        }

        // Boot ChannelIO only once
        if (window.ChannelIO && !isBooted.current) {
            window.ChannelIO('boot', {
                "pluginKey": pluginKey,
                "zIndex": 99999 // 강제 최상위 고정
            });
            isBooted.current = true;
        }

        if (window.ChannelIO) {
            window.ChannelIO('showBubble');
        }

    }, [pathname]);

    return (
        <Script
            src="https://cdn.channel.io/plugin/ch-plugin-web.js"
            strategy="afterInteractive"
        />
    );
}
