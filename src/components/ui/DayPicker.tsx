import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
    value: string;
    setValue: (value: string) => void;
    days: { valueDate: string; displayDate: string; dayOfWeek: string; disabled?: boolean }[];
    enableScrollToNextAvailable?: boolean;
};

export default ({ value, setValue, days, enableScrollToNextAvailable }: Props) => {
    const [scrolled, setScrolled] = useState(!enableScrollToNextAvailable);

    useEffect(() => {
        if (!value) {
            setValue(days[0].valueDate);
        }

        if (scrolled || !days[0].disabled || value !== days[0].valueDate) return;

        const nextAvailable = days.find((day) => !day.disabled);
        if (nextAvailable) {
            setValue(nextAvailable.valueDate);
            setScrolled(true);
        }
    }, [days]);

    return (
        <Tabs
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
        >
            {days.map(({ valueDate, displayDate, dayOfWeek, disabled }) => (
                <Tab
                    key={valueDate}
                    label={
                        <Box>
                            {displayDate}
                            <Box
                                sx={{
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                }}
                            >
                                {dayOfWeek}
                            </Box>
                        </Box>
                    }
                    value={valueDate}
                    disabled={disabled}
                    sx={{ textTransform: "none" }}
                />
            ))}
        </Tabs>
    );
};
