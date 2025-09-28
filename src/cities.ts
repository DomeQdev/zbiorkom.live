import { City } from "./typings";

const cities: Record<string, City> = {
    // bialaPodlaska: {
    //     id: "bialaPodlaska",
    //     name: "Biała Podlaska",
    //     showNewTag: true,
    //     location: [23.119268, 52.033901],
    // },
    bialystok: {
        id: "bialystok",
        name: "Białystok",
        description: "+ Wschód Express, Turośń Kościelna",
        location: [23.16319, 53.13488],
    },
    elblag: {
        id: "elblag",
        name: "Elbląg",
        location: [19.414848, 54.152099],
    },
    elk: {
        id: "elk",
        name: "Ełk",
        location: [22.361029, 53.82471],
    },
    gzm: {
        id: "gzm",
        name: "Metropolia GZM",
        description: "Katowice, Sosnowiec, Gliwice, Zabrze, ...",
        location: [19.02209, 50.25939],
    },
    iceland: {
        id: "iceland",
        name: "Ísland",
        location: [-21.934531, 64.13746],
    },
    krakow: {
        id: "krakow",
        name: "Kraków",
        location: [19.94781, 50.06865],
    },
    kielce: {
        id: "kielce",
        name: "Kielce",
        showNewTag: true,
        location: [20.618886, 50.874126],
    },
    kutno: {
        id: "kutno",
        name: "Kutno",
        location: [19.348265, 52.226985],
    },
    legnica: {
        id: "legnica",
        name: "Legnica",
        showNewTag: true,
        location: [16.16768, 51.212859],
    },
    lodz: {
        id: "lodz",
        name: "Łódź",
        location: [19.46563, 51.77025],
    },
    // lowicz: {
    //     id: "lowicz",
    //     name: "Łowicz",
    //     description: "(miasto, nie dżem)",
    //     showNewTag: true,
    //     location: [19.94557, 52.10611],
    // },
    lublin: {
        id: "lublin",
        name: "Lublin",
        location: [22.56696, 51.24607],
    },
    olsztyn: {
        id: "olsztyn",
        name: "Olsztyn",
        description: "+ Piecki, powiat olsztyński",
        location: [20.48221, 53.77792],
    },
    opole: {
        id: "opole",
        name: "Opole",
        location: [17.926775, 50.662761],
    },
    // ostroleka: {
    //     id: "ostroleka",
    //     name: "Ostrołęka",
    //     showNewTag: true,
    //     location: [21.58325, 53.08781],
    // },
    pksnova: {
        id: "pksnova",
        name: "PKS Nova",
        description: "Autobusy dalekobieżne",
        location: [17.992183, 53.134703],
    },
    poznan: {
        id: "poznan",
        name: "Poznań",
        location: [16.91249, 52.40777],
    },
    przemysl: {
        id: "przemysl",
        name: "Przemyśl",
        location: [22.775302, 49.784097],
        showNewTag: true,
    },
    radom: {
        id: "radom",
        name: "Radom",
        location: [21.14714, 51.40253],
    },
    rzeszow: {
        id: "rzeszow",
        name: "Rzeszów",
        location: [21.999114, 50.041083],
    },
    rybnik: {
        id: "rybnik",
        name: "Rybnik",
        description: "+ Jastrzębie-Zdrój",
        location: [18.548055, 50.092947],
    },
    // siedlce: {
    //     id: "siedlce",
    //     name: "Siedlce",
    //     showNewTag: true,
    //     location: [22.26820, 52.16778],
    // },
    suwalki: {
        id: "suwalki",
        name: "Suwałki",
        location: [22.932619, 54.100809],
        showNewTag: true,
    },
    szczecin: {
        id: "szczecin",
        name: "Szczecin",
        location: [14.54804, 53.43273],
    },
    tricity: {
        id: "tricity",
        name: "Trójmiasto",
        description: "Gdańsk, Gdynia, Sopot",
        location: [18.64631, 54.35188],
    },
    warsaw: {
        id: "warsaw",
        name: "Warszawa",
        description: "+ GPA, Otwock, Sochaczew, Żyrardów",
        location: [21.01173, 52.22983],
    },
    wroclaw: {
        id: "wroclaw",
        name: "Wrocław",
        location: [17.03795, 51.09789],
    },
    pkp: {
        id: "pkp",
        name: "Pociągi",
        description: "Pokazuj tylko pociągi",
        location: [21.01173, 52.22983],
        zoom: 10,
    },
}

export const cityList = Object.values(cities);

export default cities;
