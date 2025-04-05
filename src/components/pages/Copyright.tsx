import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { memo } from "react";
import { Menu } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default memo(() => {
    const { t } = useTranslation("Settings");
    const navigate = useNavigate();

    return (
        <Dialog open fullScreen>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <IconButton onClick={() => navigate(window.location.pathname, { state: "menu" })}>
                    <Menu />
                </IconButton>
                {t("dataSources")}
            </DialogTitle>

            <DialogContent>
                <p>
                    <b>Warszawa</b>: Dane rozkładowe pochodzą z Zarządu Transportu Miejskiego w Warszawie i są
                    wykorzystywane na podstawie Ustawy o otwartych danych i ponownym wykorzystywaniu
                    informacji sektora publicznego. ZTM Warszawa nie ponosi odpowiedzialności za ich
                    przetwarzanie i prezentację. Dane lokalizacyjne pojazdów ajentów pochodzą z serwisu
                    api.um.warszawa.pl. Dane lokalizacyjne MZA i TW pochodzą z wewnętrznych źródeł.
                </p>
                <p>
                    <b>Koleje Małopolskie</b>: Dane rozkładowe oraz dane o lokalizacji pociągów pochodzą z
                    systemu GTFS-RT udostępnianego przez Koleje Małopolskie. Dane mogą być przetworzone i nie
                    stanowią oficjalnej informacji przewoźnika. Koleje Małopolskie nie ponoszą
                    odpowiedzialności za szkody wynikłe z ponownego wykorzystania informacji, w tym ich
                    przetworzenia lub dalszego udostępnienia przez osoby trzecie.
                </p>
                <p>
                    <b>
                        Jeśli pominęliśmy jakieś ważne informacje, prosimy o pilny kontakt pod adresem
                        admin@zbiorkom.live.
                    </b>
                </p>
            </DialogContent>
        </Dialog>
    );
});
