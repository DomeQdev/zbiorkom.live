import Icon from "@/ui/Icon";
import getColors, { hexFromArgb } from "@/util/getColors";
import { SvgIcon } from "@mui/material";
import { VehicleType } from "typings";

type Props = {
    color: string;
    index: number;
    type: VehicleType;
    percentTraveled?: number;
    lineMargin?: number;
};

export default ({ color, index, type, percentTraveled, lineMargin }: Props) => {
    const { primary, onPrimary } = getColors(color);

    const text = hexFromArgb(primary);
    const background = hexFromArgb(onPrimary);

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
