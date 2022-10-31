import { Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { City as CityT } from "./util/typings";
import { useEffect } from "react";
import Map from "./components/Map";
import Error from "./pages/Error";
import City from "./pages/City";
import cities from "./util/cities.json";
import Settings from "./pages/Settings";
import Welcome from "./pages/Welcome";

export default () => {
    useEffect(() => {
        if (!localStorage.getItem("lang")) return localStorage.setItem("lang", ((navigator.languages && navigator.languages[0]) || navigator.language).split("-")[0]);
        toast.info(`Prosimy o korzystanie z nowej wersji aplikacji. Funkcje tej wersji zostały znacznie ograniczone.`, {
            onClick: () => {window.location.href = "https://zbiorkom.live"}
        });
    }, []);

    return <>
        <Routes>
            <Route path="/" element={<Welcome />} />
            {Object.keys(cities).map((city) => <Route path={`/${city}/*`} key={city} element={<Map city={city as CityT}><City city={city as CityT} /></Map>} />)}
            <Route path="/settings/*" element={<Settings />} />
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
