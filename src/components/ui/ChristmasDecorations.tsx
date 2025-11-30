import { memo } from "react";

interface ChristmasLightsProps {
    size?: number;
}

// Komponent śniegu na pojeździe - padający
export const VehicleSnow = memo(() => {
    return (
        <>
            {/* Padający śnieg nad pojazdem */}
            <div className="vehicle-snow-falling">
                <div className="v-flake v-f1" />
                <div className="v-flake v-f2" />
                <div className="v-flake v-f3" />
                <div className="v-flake v-f4" />
            </div>
        </>
    );
});

// Płatek śniegu dla efektu śniegu
export const Snowflake = memo(({ style }: { style: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="white" style={style}>
        <path d="M11 1v4.07c-.51.21-1.01.52-1.41.92L7.41 4H6l3.26 3.26C9.09 7.5 9 7.74 9 8c0 .55.45 1 1 1h4c.55 0 1-.45 1-1 0-.26-.09-.5-.26-.74L18 4h-1.41l-2.18 2.01c-.4-.4-.9-.71-1.41-.92V1h-2zm0 15.93c-.51-.21-1.01-.52-1.41-.92L7.41 18H6l3.26-3.26c-.17-.24-.26-.48-.26-.74 0-.55.45-1 1-1h4c.55 0 1 .45 1 1 0 .26-.09.5-.26.74L18 18h-1.41l-2.18-2.01c-.4.4-.9.71-1.41.92V23h-2v-6.07zM1 11v2h4.07c.21.51.52 1.01.92 1.41L4 16.59V18l3.26-3.26c.24.17.48.26.74.26.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1-.26 0-.5.09-.74.26L4 6h1.59l2.01 2.18c-.4.4-.71.9-.92 1.41H1zm22 2h-4.07c-.21-.51-.52-1.01-.92-1.41L20 9.41V8l-3.26 3.26c-.24-.17-.48-.26-.74-.26-.55 0-1 .45-1 1v4c0 .55.45 1 1 1 .26 0 .5-.09.74-.26L20 20h-1.59l-2.01-2.18c.4-.4.71-.9.92-1.41H23v-2z" />
    </svg>
));

// Komponent efektu padającego śniegu - z realistycznymi płatkami
export const SnowEffect = memo(({ intensity = 30 }: { intensity?: number }) => {
    const snowflakes = Array.from({ length: intensity });

    return (
        <div className="snow-container">
            {snowflakes.map((_, i) => {
                const size = 6 + Math.random() * 14;
                const left = Math.random() * 100;
                const delay = Math.random() * 6;
                const duration = 4 + Math.random() * 5;
                const opacity = 0.3 + Math.random() * 0.7;
                const blur = Math.random() > 0.7 ? 1 : 0;

                return (
                    <div
                        key={i}
                        className="snowflake"
                        style={{
                            left: `${left}%`,
                            width: size,
                            height: size,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                            opacity,
                            filter: blur ? `blur(${blur}px)` : undefined,
                        }}
                    />
                );
            })}
        </div>
    );
});

// Świąteczna ramka dekoracyjna
export const ChristmasFrame = memo(({ children }: { children: React.ReactNode }) => (
    <div className="christmas-frame">
        <div className="christmas-corner christmas-corner-tl" />
        <div className="christmas-corner christmas-corner-tr" />
        <div className="christmas-corner christmas-corner-bl" />
        <div className="christmas-corner christmas-corner-br" />
        {children}
    </div>
));

// Świąteczna wstążka
export const ChristmasRibbon = memo(({ text }: { text: string }) => (
    <div className="christmas-ribbon">
        <span>{text}</span>
    </div>
));

export default VehicleSnow;
