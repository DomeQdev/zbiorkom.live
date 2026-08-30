import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ETrip, Trip } from "typings";

export default ({ trip }: { trip: Trip }) => {
    const { t } = useTranslation("Vehicle");

    const description = trip[ETrip.description];

    return (
        !!description?.length && (
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    color: "lightgrey",
                    textAlign: "center",
                    paddingBottom: 1,
                }}
            >
                {description.map(([key, value], index, array) => (
                    <span key={index}>
                        {t(key, { value, interpolation: { escapeValue: false } })}
                        {index < array.length - 1 && <>&nbsp;·&nbsp;</>}
                    </span>
                ))}
            </Typography>
        )
    );
};
