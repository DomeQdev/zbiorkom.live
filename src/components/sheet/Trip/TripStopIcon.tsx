import { SvgIcon } from "@mui/material";
import { VehicleType } from "typings";
import Icon from "@/ui/Icon";

type Props = {
    color: [color: string, text: string, background: string];
    index: number;
    type: VehicleType;
    percentTraveled?: number;
    lineMargin?: number;
};

export default ({ color: [color, text, background], index, type, percentTraveled, lineMargin }: Props) => {
    return (
        <>
            <span
                className="vehicleStopIcon"
                style={{
                    border: `3px solid ${color}`,
                }}
            />
            {index !== 0 && (
                <span
                    className="vehicleStopIconLine"
                    style={{
                        backgroundColor: color,
                        marginLeft: lineMargin,
                    }}
                >
                    {percentTraveled !== undefined && (
                        <SvgIcon
                            key="percentTraveled"
                            sx={{
                                position: "absolute",
                                marginLeft: "-5px",
                                marginTop: "-14px",
                                top: `${percentTraveled}%`,
                                fontSize: "26px",
                                color: text,
                                backgroundColor: background,
                                borderRadius: "50%",
                                padding: "3px",
                                zIndex: 20,
                                border: `1px solid ${color}`,
                                transition: "top 0.5s",
                            }}
                        >
                            <Icon type={type} />
                        </SvgIcon>
                    )}
                </span>
            )}
        </>
    );
};
