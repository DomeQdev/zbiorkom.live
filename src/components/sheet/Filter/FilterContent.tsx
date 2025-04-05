import { useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import FilterSearchResult from "./FilterSearchResult";
import FilterRoutesNearby from "./FilterRoutesNearby";
import FilterActive from "./FilterActive";
import FilterHowToUse from "./FilterHowToUse";
import useQueryRoutesNearby from "@/hooks/useQueryRoutesNearby";
import useQuerySearchRoutesOrModels from "@/hooks/useQuerySearchRoutesOrModels";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";

export default () => {
    const [search, tempRoutes, tempModels] = useFilterStore(
        useShallow((state) => [state.search, state.tempRoutes, state.tempModels])
    );
    const { city } = useParams();

    const { data: routesNearby } = useQueryRoutesNearby({ city: city! });
    const { data: searchResults } = useQuerySearchRoutesOrModels({ city: city! });

    const items = [
        (!!tempRoutes.length || !!tempModels.length) && (
            <FilterActive routes={tempRoutes} models={tempModels} />
        ),
        !!routesNearby?.length && (
            <FilterRoutesNearby routesNearby={routesNearby} filteredRoutes={tempRoutes} />
        ),
        <FilterHowToUse />,
    ].filter(Boolean);

    return (
        <Virtuoso
            style={{ height: "calc(var(--rsbs-overlay-h) - 68px)" }}
            totalCount={search ? searchResults?.length ?? 0 : items.length}
            itemContent={(index) => {
                if (search) {
                    const item = searchResults?.[index];
                    if (!item) return null;

                    return <FilterSearchResult result={item} />;
                }

                return items[index];
            }}
        />
    );
};
