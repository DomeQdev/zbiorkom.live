import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "typings";

type Props = {
    id: string;
};

const fetchData = (id: Props["id"], signal: AbortSignal) => {
    return fetchWithAuth<BlogPost>(`${Gay.cloudBase}/blog/${id}`, signal);
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["blog", props.id],
        queryFn: ({ signal }) => fetchData(props.id, signal),
    });
};
