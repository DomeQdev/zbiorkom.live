import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "live.zbiorkom.app",
    appName: "zbiorkom.live",
    webDir: "dist",
    bundledWebRuntime: false,
    server: {
        androidScheme: "https",
    },
    ios: {
        contentInset: "automatic",
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 1200,
            launchAutoHide: true,
            backgroundColor: "#276b2b",
            showSpinner: false,
            iosSpinnerStyle: "small",
        },
    },
};

export default config;
