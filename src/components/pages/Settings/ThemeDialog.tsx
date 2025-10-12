import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import useGoBack from "@/hooks/useGoBack";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import useThemeStore from "@/hooks/useThemeStore";
import { useShallow } from "zustand/react/shallow";

const colors = ["#ff3c36", "#ffd336", "#94ff36", "#276b2b", "#36f9ff", "#3662ff", "#720546", "#ff36c7"];

export default () => {
    const [selectedColor, setColor] = useThemeStore(useShallow((state) => [state.color, state.setColor]));
    const { t } = useTranslation("Settings");
    const goBack = useGoBack();

    return (
        <Dialog open onClose={() => goBack()} fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <IconButton onClick={() => goBack()}>
                    <Close />
                </IconButton>
                {t("changeTheme")}
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 1,
                    padding: 2,
                    placeItems: "center",
                }}
            >
                {colors.map((color) => {
                    const hashColor = `${color}`;

                    return (
                        <IconButton
                            key={color}
                            onClick={() => setColor(hashColor)}
                            sx={{
                                backgroundColor: hashColor,
                                borderRadius: "50%",
                                margin: 2,
                                padding: 0,
                                width: "2.5rem",
                                height: "2.5rem",
                                transition: "opacity .3s",
                                "&:hover": {
                                    backgroundColor: hashColor,
                                    opacity: 0.8,
                                },
                                "&:disabled": {
                                    backgroundColor: hashColor,
                                    opacity: 0.3,
                                },
                            }}
                            disabled={selectedColor === hashColor}
                        />
                    );
                })}
            </DialogContent>
        </Dialog>
    );
};
