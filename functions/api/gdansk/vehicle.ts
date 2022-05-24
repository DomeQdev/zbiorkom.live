export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let tab = url.searchParams.get('tab');
    let type = url.searchParams.get('type');
    if (!tab || !type) return new Response("No params", { status: 400 });

    let vehicles: [{
        AED: "tak" | "nie",
        USB: "tak" | "nie",
        biletomat: "tak" | "nie",
        dlugosc: string,
        drzwi_pasazerskie: string,
        foto: string,
        klimatyzacja: "tak" | "nie",
        liczba_miejsc_siedzacych: string,
        liczba_miejsc_stojacych: string,
        link: string,
        marka: string,
        mocowanie_rowerow: string,
        model: string,
        monitor_wewnetrzny: "tak" | "nie",
        monitoring: "tak" | "nie",
        nr_inwentarzowy: string,
        operator_przewoznik: string,
        patron: string,
        pojazd_dwukierunkowy: "tak" | "nie",
        pojazd_zabytkowy: "tak" | "nie",
        przyklek: "tak" | "nie",
        rampa_dla_wozkow: "tak" | "nie",
        rodzaj_pojazdu: "Autobus" | "Tramwaj",
        rok_produkcji: string,
        typ_pojazdu: string,
        wysokosc_podlogi: string,
        zapowiedzi_glosowe: "tak" | "nie",
    }] = await fetch("https://files.cloudgdansk.pl/d/otwarte-dane/ztm/baza-pojazdow.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 / 2,
            cacheEverything: true
        },
        keepalive: true,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
        }
    }).then(res => res.json()).then(res => res.results).catch(() => []);
    if (!vehicles) return new Response("Error", { status: 500 });

    let vehicleData = vehicles.find(v => v.nr_inwentarzowy === tab && v.rodzaj_pojazdu === (type === "bus" ? "Autobus" : "Tramwaj"));
    if (!vehicleData) return new Response("Not Found", { status: 404 });

    let features: string[] = [];
    if (vehicleData.AED === "tak") features.push("AED");
    if (vehicleData.USB === "tak") features.push("USB");
    if (vehicleData.biletomat === "tak") features.push("automat biletowy");
    if (vehicleData.klimatyzacja === "tak") features.push("klimatyzacja");
    if (vehicleData.monitoring === "tak" || vehicleData.monitor_wewnetrzny === "tak") features.push("monitoring");
    if (vehicleData.pojazd_dwukierunkowy === "tak") features.push("pojazd dwukierunkowy");
    if (vehicleData.pojazd_zabytkowy === "tak") features.push("pojazd zabytkowy");
    if (vehicleData.przyklek === "tak") features.push("przyklęk");
    if (vehicleData.rampa_dla_wozkow === "tak") features.push("rampa");
    if (vehicleData.zapowiedzi_glosowe === "tak") features.push("zapowiedzi głosowe");

    return new Response(JSON.stringify({
        tab: vehicleData.nr_inwentarzowy,
        type: vehicleData.rodzaj_pojazdu === "Autobus" ? "bus" : "tram",
        photo: vehicleData.foto !== "no-foto" ? `https://files.cloudgdansk.pl/f/otwarte-dane/ztm/baza-pojazdow/${vehicleData.foto}.jpg` : null,
        model: `${vehicleData.marka} ${vehicleData.model}`,
        prodYear: vehicleData.rok_produkcji,
        carrier: vehicleData.operator_przewoznik,
        doors: Number(vehicleData.drzwi_pasazerskie),
        seats: Number(vehicleData.liczba_miejsc_siedzacych),
        length: `${vehicleData.dlugosc}m`,
        bikes: Number(vehicleData.mocowanie_rowerow),
        features
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=2592000"
        }
    });
};