import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { City as CityT } from "./util/typings";
import Map from "./components/Map";
import Error from "./pages/Error";
import City from "./pages/City";
import cities from "./util/cities.json";

export default () => {
    return <>
        <Routes>
            <Route path="/" element={<a href="/warsaw">Warszawa</a>} />
            {Object.keys(cities).map((city) => <Route path={`/${city}/*`} key={city} element={<Map city={city as CityT}><City city={city as CityT} /></Map>} />)}
            <Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
        </Routes>
        <ToastContainer
            position="top-left"
            autoClose={7500}
            newestOnTop
            theme="dark"
            pauseOnFocusLoss={false}
            limit={5}
            pauseOnHover
        />
    </>;
};