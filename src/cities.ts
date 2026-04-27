import { City } from "./typings";

const cities: Record<string, City> = {};
export const cityList: City[] = [];

export const loadCities = async () => {
    const res = await fetch(`${Gay.base}/api6`);
    const data = await res.json();

    for (const c of data.cities || []) {
        const city: City = {
            id: c.id,
            name: c.name,
            description: c.description,
            location: c.location,
            agencies: c.agencies,
            virtual: c.virtual,
        };

        cities[c.id] = city;
        cityList.push(city);
    }
};

export default cities;
