import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Map from "./components/Map";
import Error from "./pages/Error";
import Warsaw from "./cities/Warsaw";
import Gdansk from "./cities/Gdansk";

export default () => {
    return <>
        <Routes>
            <Route path="/" element={<>Witaj</>} />
            <Route path="/warsaw/*" element={<Map city="warsaw"><Warsaw /></Map>} />
            <Route path="/gdansk/*" element={<Map city="gdansk"><Gdansk /></Map>} />
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