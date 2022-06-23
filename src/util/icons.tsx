import { DirectionsBus, Tram, DirectionsTransit, DirectionsRailway, Subway, Train, LtePlusMobiledata, Room } from '@mui/icons-material';

export default ({ size }: { size?: number }) => {
    const icons = {
        bus: {
            icon: <DirectionsBus style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#006b47"
        },
        tram: {
            icon: <Tram style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#007bff"
        },
        metro: {
            icon: <Subway style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#CF51D4"
        },
        wkd: {
            icon: <DirectionsRailway style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#D4B451"
        },
        skm: {
            icon: <Train style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#69C345"
        },
        rail: {
            icon: <Train style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#3606A3"
        },
        km: {
            icon: <DirectionsTransit style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#432DC8"
        },
        trolley: {
            icon: <LtePlusMobiledata style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#4586C3"
        },
        unknown: {
            icon: <Room style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#6B3BC4"
        }
    };

    return icons;
};