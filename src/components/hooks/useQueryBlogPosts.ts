import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "typings";

const fetchData = (signal: AbortSignal) => {
    return fetchWithAuth<BlogPost[]>(`${Gay.cloudBase}/blog`, signal);
};

export default () => {
    return useQuery({
        queryKey: ["blog"],
        queryFn: ({ signal }) => fetchData(signal),
    });
};
