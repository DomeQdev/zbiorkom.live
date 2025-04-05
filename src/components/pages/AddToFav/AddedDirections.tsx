import { Remove, SubdirectoryArrowRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

type Props = {
    directions: [string, string][];
    onRemove: (index: number) => void;
};

export default ({ directions, onRemove }: Props) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                "& div": {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    paddingLeft: 2,
                    borderRadius: 0.4,
                    backgroundColor: "background.paper",
                    "& > span": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    },
                    "&:first-of-type": {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    },
                    "&:last-child": {
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                    },
                },
            }}
        >
            {directions.map((direction, index) => (
                <div key={direction[0]}>
                    <span>
                        <SubdirectoryArrowRight />
                        <span>{direction[1]}</span>
                    </span>

                    <IconButton onClick={() => onRemove(index)}>
                        <Remove />
                    </IconButton>
                </div>
            ))}
        </Box>
    );
};
