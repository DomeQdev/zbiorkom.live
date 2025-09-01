import { Box, ButtonBase, Grow, Typography } from "@mui/material";
import { EStopDeparture, EStopTime, NonTransitLeg, PlannerItinerary, StopTime, TransitLeg } from "typings";
import ItineraryTransitLeg from "./ItineraryTransitLeg";
import ItineraryNonTransitLeg from "./ItineraryNonTransitLeg";

export default ({ itineraries }: { itineraries: PlannerItinerary[] }) => {
    return (
        <Grow in>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    margin: 2,
                    "& > :first-of-type": {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                    "& > :last-of-type": {
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                    },
                }}
            >
                {itineraries.map((itinerary, index) => (
                    <ButtonBase
                        sx={{
                            width: "100%",
                            paddingX: 1.5,
                            paddingY: 1,
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            backgroundColor: "background.paper",
                        }}
                        key={`itinerary-${index}`}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, marginRight: 1 }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                                {itinerary.map((leg, index) =>
                                    leg.mode === "TRANSIT" ? (
                                        <ItineraryTransitLeg key={index} leg={leg as TransitLeg} />
                                    ) : (
                                        <ItineraryNonTransitLeg key={index} leg={leg as NonTransitLeg} />
                                    )
                                )}
                            </Box>
                            <Typography variant="caption">xyz</Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                display: "flex",
                                alignSelf: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {calculateRealisticTravelTime(itinerary) ?? "N/A"} min
                        </Typography>
                    </ButtonBase>
                ))}
            </Box>
        </Grow>
    );
};

/**
 * Pomocnicza funkcja do pobierania rzeczywistego czasu (estymowanego lub planowego).
 * @param time - Obiekt StopTime
 * @returns Timestamp w milisekundach
 */
const getRealTime = (time: StopTime): number => {
    // Preferuj czas estymowany (na żywo), jeśli jest dostępny i poprawny
    if (typeof time[EStopTime.estimated] === "number" && time[EStopTime.estimated] > 0) {
        return time[EStopTime.estimated];
    }
    // W przeciwnym razie użyj czasu planowego
    return time[EStopTime.scheduled];
};

/**
 * Oblicza całkowity czas podróży w minutach, uwzględniając rzeczywiste odjazdy.
 * Czas jest liczony od momentu, w którym użytkownik musi wyjść, do momentu dotarcia do celu.
 *
 * @param itinerary - Tablica etapów podróży (PlannerItinerary).
 * @returns Całkowity czas podróży w minutach lub `null`, jeśli trasa jest niewykonalna.
 */
export const calculateRealisticTravelTime = (itinerary: PlannerItinerary): number | null => {
    if (!itinerary || itinerary.length === 0) {
        return 0;
    }

    const now = Date.now();

    // 1. ZNAJDŹ PIERWSZY ETAP TRANSPORTU PUBLICZNEGO (TRANSIT LEG)
    const firstTransitIndex = itinerary.findIndex((leg) => leg.mode === "TRANSIT");

    // --- PRZYPADEK 1: Trasa bez transportu publicznego (np. tylko spacer) ---
    if (firstTransitIndex === -1) {
        // Sumujemy czas trwania wszystkich etapów (które są typu NonTransitLeg)
        const totalDurationMs = itinerary.reduce((sum, leg) => sum + (leg as NonTransitLeg).duration, 0);
        return Math.ceil(totalDurationMs / 60000); // Konwersja ms na minuty
    }

    // --- PRZYPADEK 2: Trasa z co najmniej jednym etapem transportu publicznego ---

    // 2. OBLICZ CZAS DOJŚCIA DO PIERWSZEGO PRZYSTANKU
    let timeToReachFirstStopMs = 0;
    for (let i = 0; i < firstTransitIndex; i++) {
        timeToReachFirstStopMs += (itinerary[i] as NonTransitLeg).duration;
    }

    // Czas, o którym użytkownik dotrze na pierwszy przystanek, jeśli wyjdzie teraz
    const arrivalTimeAtFirstStop = now + timeToReachFirstStopMs;

    // 3. ZNAJDŹ NAJBLIŻSZY MOŻLIWY ODJAZD DLA PIERWSZEGO ETAPU
    const firstTransitLeg = itinerary[firstTransitIndex] as TransitLeg;
    const firstAvailableDeparture = firstTransitLeg.departures.find((dep) => {
        const departureTime = getRealTime(dep[EStopDeparture.departure]);
        // Odjazd musi być w przyszłości względem czasu dotarcia na przystanek
        return departureTime >= arrivalTimeAtFirstStop;
    });

    // Jeśli nie ma dostępnych odjazdów, trasa jest niewykonalna
    if (!firstAvailableDeparture) {
        return null;
    }

    // 4. USTAL KLUCZOWE PUNKTY CZASOWE
    const actualDepartureTime = getRealTime(firstAvailableDeparture[EStopDeparture.departure]);
    const arrivalTimeFromFirstTransit = firstAvailableDeparture[EStopDeparture.destination]
        ? getRealTime(firstAvailableDeparture[EStopDeparture.destination])
        : null;

    if (arrivalTimeFromFirstTransit === null) {
        // Jeśli nie ma czasu przyjazdu, nie możemy kontynuować kalkulacji
        return null;
    }

    // Moment, w którym użytkownik musi wyjść z domu
    const leaveHomeTime = actualDepartureTime - timeToReachFirstStopMs;

    // Inicjalizacja "aktualnego czasu" podróży na moment zakończenia pierwszego etapu tranzytowego
    let currentTime = arrivalTimeFromFirstTransit;

    // 5. SYMULUJ POZOSTAŁĄ CZĘŚĆ PODRÓŻY
    for (let i = firstTransitIndex + 1; i < itinerary.length; i++) {
        const currentLeg = itinerary[i];

        if (currentLeg.mode === "TRANSIT") {
            // Etap z transportem publicznym (przesiadka)
            const nextTransitLeg = currentLeg as TransitLeg;
            const nextAvailableDeparture = nextTransitLeg.departures.find((dep) => {
                const departureTime = getRealTime(dep[EStopDeparture.departure]);
                // Znajdź odjazd po tym, jak dotarliśmy na przystanek przesiadkowy
                return departureTime >= currentTime;
            });

            if (!nextAvailableDeparture) {
                // Nie zdążyliśmy na żadne połączenie, trasa niewykonalna
                return null;
            }

            const arrivalTime = nextAvailableDeparture[EStopDeparture.destination]
                ? getRealTime(nextAvailableDeparture[EStopDeparture.destination])
                : null;

            if (arrivalTime === null) return null;

            // Zaktualizuj aktualny czas na czas przyjazdu po tym etapie
            currentTime = arrivalTime;
        } else {
            // Etap bez transportu publicznego (spacer, rower itp.)
            const nonTransitLeg = currentLeg as NonTransitLeg;
            currentTime += nonTransitLeg.duration;
        }
    }

    // 6. OBLICZ FINALNY CZAS PODRÓŻY
    // `currentTime` to teraz czas dotarcia do celu
    const totalTravelTimeMs = currentTime - leaveHomeTime;

    return Math.ceil(totalTravelTimeMs / 60000); // Zwróć w minutach, zaokrąglając w górę
};
