import { DirectionsBus, Tram, DirectionsTransit, DirectionsRailway, Subway, Train, LtePlusMobiledata } from '@mui/icons-material';

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
            color: "#ccc"
        },
        wkd: {
            icon: <DirectionsRailway style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#ccc"
        },
        skm: {
            icon: <Train style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#009955"
        },
        rail: {
            icon: <Train style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#009955"
        },
        km: {
            icon: <DirectionsTransit style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#0A6F0A"
        },
        trolley: {
            icon: <LtePlusMobiledata style={{ height: `${size}px`, width: `${size}px` }} />,
            color: "#009955"
        }
    };

    return icons;
};