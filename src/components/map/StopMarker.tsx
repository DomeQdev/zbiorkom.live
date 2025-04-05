import Icon, { defaultColors } from "@/ui/Icon";
import { SvgIcon } from "@mui/material";
import { EStop, Stop } from "typings";

export default ({ stop, disablePadding }: { stop: Stop; disablePadding?: boolean }) => {
    const color = defaultColors[stop[EStop.type]];

    if (stop[EStop.station]) {
        return (
            <SvgIcon
                sx={{
                    color: "hsla(0, 0%, 100%, 0.8)",
                    backgroundColor: color,
                    cursor: "pointer",
                    borderRadius: 0.5,
                    padding: 0.3,
                    width: 26,
                    height: 26,
                }}
            >
                <Icon type={stop[EStop.type]} />
            </SvgIcon>
        );
    }

    return (
        <svg
            width="30"
            height="30"
            viewBox={`0 ${disablePadding ? 0 : -4} 30 30`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer", transform: `rotate(${stop[EStop.bearing] || 0}deg)` }}
        >
            <circle cx="15" cy="15" r="11" fill={color} />
            <g
                data-stop-icon
                fill="hsla(0, 0%, 100%, 0.8)"
                transform={`translate(6, 6) scale(0.75) rotate(${-stop[EStop.bearing] || 0} 12 12)`}
            >
                <Icon type={stop[EStop.type]} />
            </g>
            {stop[EStop.bearing] !== null && (
                <g transform={`translate(15, 15) rotate(45) translate(-30, -30)`}>
                    <path d="m10 19 5-5 5 5z" fill={color} transform="rotate(-45 19.5 13)" />
                </g>
            )}
        </svg>
    );
};
