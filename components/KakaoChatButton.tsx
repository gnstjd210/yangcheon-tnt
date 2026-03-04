"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function KakaoChatButton() {
    const KAKAO_JS_KEY = "c089c8172def97eb00c07217cae17495";
    const CHANNEL_ID = "_xcxlAcG";

    const initKakao = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(KAKAO_JS_KEY);
        }
    };

    useEffect(() => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            renderButton();
        }
    }, []);

    const renderButton = () => {
        if (window.Kakao && window.Kakao.Channel) {
            // Clear previous instances if any
            const container = document.getElementById("kakao-talk-channel-chat-button");
            if (container) {
                container.innerHTML = "";
            }

            window.Kakao.Channel.createChatButton({
                container: "#kakao-talk-channel-chat-button",
                channelPublicId: CHANNEL_ID,
                title: "consult",
                size: "large",
                color: "yellow",
                shape: "pc",
                supportMultipleDensities: true,
            });
        }
    };

    return (
        <>
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    initKakao();
                    renderButton();
                }}
            />
            {/* Positioned above usual bottom-right widgets (like Channel Talk) */}
            <div
                id="kakao-talk-channel-chat-button"
                className="fixed bottom-[100px] right-[20px] z-[9999]"
            ></div>
        </>
    );
}
