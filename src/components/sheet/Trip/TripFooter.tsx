import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ETrip, Trip } from "typings";

export default ({ trip }: { trip: Trip }) => {
    const { t } = useTranslation("Vehicle");

    return (
        !!trip[ETrip.description] && (
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    color: "lightgrey",
                    textAlign: "center",
                    paddingBottom: 1,
                }}
            >
                {trip[ETrip.description].split(";").map((pair, index, array) => {
                    const [key, value] = pair.split(":");
                    return (
                        <span key={index}>
                            {t(key, { value, interpolation: { escapeValue: false } })}
                            {index < array.length - 1 && <>&nbsp;·&nbsp;</>}
                        </span>
                    );
                })}
            </Typography>
        )
    );
};
