import { PushNotifications, Token } from "@capacitor/push-notifications";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

const isNative = () => Capacitor.isNativePlatform();

const pushRegisterUrl = import.meta.env.VITE_PUSH_REGISTER_URL;

const normalizePathFromUrl = (rawUrl: string) => {
    const url = new URL(rawUrl);
    return `${url.pathname}${url.search}${url.hash}`;
};

const navigateToPath = (path: string) => {
    window.history.pushState({}, "", path || "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
};

const registerPushToken = async (token: Token) => {
    if (!pushRegisterUrl) {
        console.warn("VITE_PUSH_REGISTER_URL is not configured; push token won't be registered.");
        return;
    }

    const response = await fetch(pushRegisterUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: token.value,
            platform: Capacitor.getPlatform(),
        }),
    });

    if (!response.ok) {
        throw new Error(`Push token registration failed with status ${response.status}`);
    }
};

const setupDeepLinking = () => {
    App.addListener("appUrlOpen", ({ url }) => {
        const path = normalizePathFromUrl(url);
        navigateToPath(path);
    });
};

const setupPushNotifications = async () => {
    let permissions = await PushNotifications.checkPermissions();

    if (permissions.receive === "prompt") {
        permissions = await PushNotifications.requestPermissions();
    }

    if (permissions.receive !== "granted") {
        console.warn("Push notification permissions were not granted.");
        return;
    }

    PushNotifications.addListener("registration", (token) => {
        registerPushToken(token).catch((error) => {
            console.error("Could not register push token:", error);
        });
    });

    PushNotifications.addListener("registrationError", (error) => {
        console.error("Push registration error:", error);
    });

    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
        const deepLink = notification.notification.data?.deepLink;
        if (typeof deepLink === "string" && deepLink.startsWith("/")) {
            navigateToPath(deepLink);
        }
    });

    await PushNotifications.register();
};

const setupGeolocation = async () => {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location === "prompt" || permissions.coarseLocation === "prompt") {
        await Geolocation.requestPermissions();
    }
};

export const initMobileApp = async () => {
    if (!isNative()) return;

    setupDeepLinking();
    await setupGeolocation();
    await setupPushNotifications();
};
