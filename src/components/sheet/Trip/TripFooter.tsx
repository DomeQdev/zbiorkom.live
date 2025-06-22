import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ETrip, ETripStop, Trip } from "typings";
import { useQueryNextTrip } from "@/hooks/useQueryNextTrip";
import { getTime } from "@/util/tools";
import { useState, useEffect } from "react";

export default ({ trip }: { trip: Trip }) => {
    const { t: tVehicle } = useTranslation("Vehicle");
    const { t: tTrip } = useTranslation("Trip");
    const [currentTime, setCurrentTime] = useState(Date.now());
    
    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);
    
    const { data: nextTripData } = useQueryNextTrip({
        city: trip[ETrip.city],
        currentTrip: trip,
        enabled: true,
    });

    const renderNextTripInfo = () => {
        if (!nextTripData?.nextTrip) return null;
        
        const { departureTime, firstStopName, isLoop } = nextTripData.nextTrip;
        const minutesUntilDeparture = Math.floor((departureTime - currentTime) / 60000);
        const departureTimeFormatted = getTime(departureTime);
        
        // Show time if departure is more than 60 minutes away, otherwise show minutes
        const showTime = minutesUntilDeparture > 60;
        
        let translationKey: string;
        let translationParams: any;
        
        if (isLoop) {
            translationKey = showTime ? "nextDepartureFromLoopAt" : "nextDepartureFromLoop";
            translationParams = showTime 
                ? { time: departureTimeFormatted }
                : { minutes: minutesUntilDeparture };
        } else {
            translationKey = showTime ? "nextDepartureFromFirstAt" : "nextDepartureFromFirst";
            translationParams = showTime 
                ? { stopName: firstStopName, time: departureTimeFormatted }
                : { stopName: firstStopName, minutes: minutesUntilDeparture };
        }
        
        return (
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    color: "lightgrey",
                    textAlign: "center",
                    paddingBottom: 1,
                }}
            >
                {tTrip(translationKey, translationParams) as string}
            </Typography>
        );
    };

    return (
        <Box>
            {!!trip[ETrip.description] && (
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        color: "lightgrey",
                        textAlign: "center",
                        paddingBottom: nextTripData?.nextTrip ? 0.5 : 1,
                    }}
                >
                    {trip[ETrip.description].split(";").map((pair, index, array) => {
                        const [key, value] = pair.split(":");
                        return (
                            <span key={index}>
                                {tVehicle(key, { value, interpolation: { escapeValue: false } })}
                                {index < array.length - 1 && <>&nbsp;·&nbsp;</>}
                            </span>
                        );
                    })}
                </Typography>
            )}
            {renderNextTripInfo()}
        </Box>
    );
};
