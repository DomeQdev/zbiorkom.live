import Icon from "@/ui/Icon";
import { Box, SvgIcon } from "@mui/material";
import { ERoute, TransitLeg } from "typings";

const maxRoutesToShow = 3;

export default ({ leg }: { leg: TransitLeg }) => {
    const slicedRoutes = leg.routes.slice(0, maxRoutesToShow + 1);
    const isOverflowing = leg.routes.length > maxRoutesToShow;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.25,
                "& .MuiBox-root": {
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    color: "hsla(0, 0%, 100%, 0.8)",
                    gap: 0.5,
                    fontSize: 14,
                    padding: "4px 8px",
                    "& .MuiSvgIcon-root": {
                        fontSize: 16,
                    },
                },
            }}
        >
            {slicedRoutes.map((route, index) => {
                const isDifferentType = slicedRoutes[index - 1]?.[ERoute.type] !== route[ERoute.type];
                const isDifferentAgency = slicedRoutes[index - 1]?.[ERoute.agency] !== route[ERoute.agency];
                const isFirst = index === 0;
                const isLast = index === slicedRoutes.length - 1;

                return (
                    <Box
                        sx={{
                            borderTopLeftRadius: isFirst ? 8 : 0,
                            borderBottomLeftRadius: isFirst ? 8 : 0,
                            borderTopRightRadius: isLast ? 8 : 0,
                            borderBottomRightRadius: isLast ? 8 : 0,
                            backgroundColor: route[ERoute.color],
                        }}
                    >
                        {isOverflowing && isLast ? (
                            "..."
                        ) : (
                            <>
                                {(isDifferentAgency || isDifferentType) && (
                                    <SvgIcon>
                                        <Icon type={route[ERoute.type]} agency={route[ERoute.agency]} />
                                    </SvgIcon>
                                )}
                                {route[ERoute.name]}
                            </>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};
