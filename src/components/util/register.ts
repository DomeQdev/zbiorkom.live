import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import en from "@/translations/en.json";
import pl from "@/translations/pl.json";

const isGoogleBot = navigator.userAgent.includes("Googlebot");

i18n.use(initReactI18next).init({
    resources: {
        en,
        pl,
    },
    lng: isGoogleBot ? "pl" : localStorage.getItem("language") || navigator.language.split("-")[0],
    fallbackLng: "pl",
});

document
    .querySelector("meta[name=theme-color]")
    ?.setAttribute("content", localStorage.getItem("themeColor") || "#276b2b");

if (location.protocol === "http:") {
    window.Gay = {
        // base: "http://localhost:8005",
        base: "https://api.zbiorkom.live",
        cloudBase: "https://4.zbiorkom.live",
        ws: "https://ws.zbiorkom.live",
    };
} else {
    window.Gay = {
        base: "https://api.zbiorkom.live",
        cloudBase: "https://4.zbiorkom.live",
        ws: "https://ws.zbiorkom.live",
    };
}

console.log(
    "%czbiorkom.live",
    "font-size: 64px; color: #276b2b; font-weight: bold; text-shadow: 0 0 10px #276b2b;"
);

console.log(
    "%cHej! Widzę, że interesuje Cię nasz kod 😊\n" +
        "Jeśli masz pytania lub chcesz dowiedzieć się więcej, dołącz do nas tutaj: https://discord.gg/gUhMz2Wckf",
    "color: #5662f6; font-size: 16px; font-weight: bold;"
);
