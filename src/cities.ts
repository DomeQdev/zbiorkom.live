import { City } from "./typings";

const cities = {
    // bialaPodlaska: {
    //     id: "bialaPodlaska",
    //     name: "Biała Podlaska",
    //     showNewTag: true,
    //     location: [23.119268, 52.033901],
    // },
    bialystok: {
        id: "bialystok",
        name: "Białystok",
        location: [23.16319, 53.13488],
    },
    elblag: {
        id: "elblag",
        name: "Elbląg",
        showNewTag: true,
        location: [19.414848, 54.152099],
    },
    // elk: {
    //     id: "elk",
    //     name: "Ełk",
    //     showNewTag: true,
    //     location: [22.361029, 53.824710],
    // },
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
    kutno: {
        id: "kutno",
        name: "Kutno",
        showNewTag: true,
        location: [19.348265, 52.226985],
    },
    // legnica: {
    //     id: "legnica",
    //     name: "Legnica",
    //     showNewTag: true,
    //     location: [16.15638, 51.21006],
    // },
    lodz: {
        id: "lodz",
        name: "Łódź",
        location: [19.46563, 51.77025],
        showNewTag: true,
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
        location: [20.48221, 53.77792],
    },
    opole: {
        id: "opole",
        name: "Opole",
        showNewTag: true,
        location: [17.926775, 50.662761],
    },
    // ostroleka: {
    //     id: "ostroleka",
    //     name: "Ostrołęka",
    //     showNewTag: true,
    //     location: [21.58325, 53.08781],
    // },
    poznan: {
        id: "poznan",
        name: "Poznań",
        location: [16.91249, 52.40777],
    },
    radom: {
        id: "radom",
        name: "Radom",
        showNewTag: true,
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
        showNewTag: true,
        location: [18.548055, 50.092947],
    },
    // siedlce: {
    //     id: "siedlce",
    //     name: "Siedlce",
    //     showNewTag: true,
    //     location: [22.26820, 52.16778],
    // },
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
        disableVehicleInfo: true,
    },
    warsaw: {
        id: "warsaw",
        name: "Warszawa",
        description: "+ Grodziskie Przewozy Autobusowe",
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
} as {
    [key: string]: City;
};

export const cityList = Object.values(cities);

export default cities;
