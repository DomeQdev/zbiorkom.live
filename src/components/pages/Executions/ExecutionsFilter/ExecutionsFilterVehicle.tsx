import { Box, MenuItem, Select, SvgIcon, TextField } from "@mui/material";
import { SearchState } from "@/hooks/useSearchState";
import { useEffect, useState } from "react";
import { VehicleType } from "typings";
import Icon from "@/ui/Icon";

export default ({ vehicle: [vehicle, setVehicle] }: { vehicle: SearchState }) => {
    const [initialValue] = useState(vehicle.split("/"));

    const [vehicleId, setVehicleId] = useState<string>(initialValue[1] ?? "");
    const [vehicleType, setVehicleType] = useState<VehicleType>(
        Number.isNaN(+initialValue[0]) ? 3 : (+initialValue[0] as VehicleType)
    );

    useEffect(() => {
        setVehicle(vehicleId ? `${vehicleType}/${vehicleId}` : "");
    }, [vehicleId, vehicleType]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.25,
            }}
        >
            <Select
                size="small"
                variant="filled"
                value={vehicleType}
                onChange={({ target }) => setVehicleType(target.value as VehicleType)}
                disableUnderline
                sx={{
                    borderRadius: 0,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                    height: 40,
                }}
                renderValue={(selected) => (
                    <SvgIcon
                        sx={{
                            position: "relative",
                            top: -4,
                            width: 22,
                            height: 22,
                        }}
                    >
                        <Icon type={selected as VehicleType} />
                    </SvgIcon>
                )}
            >
                {[0, 2, 3, 11].map((type) => (
                    <MenuItem key={type} value={type}>
                        <SvgIcon>
                            <Icon type={type as VehicleType} />
                        </SvgIcon>
                    </MenuItem>
                ))}
            </Select>

            <TextField
                size="small"
                value={vehicleId}
                onChange={({ target }) => setVehicleId(target.value)}
                label="Pojazd"
                sx={{
                    "& .MuiInputBase-root": {
                        borderRadius: 0,
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                    },
                }}
                slotProps={{
                    input: {
                        autoComplete: "off",
                        autoCapitalize: "off",
                    },
                }}
            />
        </Box>
    );
};
