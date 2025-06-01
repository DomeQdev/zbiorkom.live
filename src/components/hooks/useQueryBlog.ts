import { getFromCloudAPI } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "typings";

export const useQueryBlogPost = ({ id }: { id: string }) => {
    return useQuery({
        queryKey: ["blog", id],
        queryFn: ({ signal }) => getFromCloudAPI<BlogPost>(`blog/${id}`, {}, signal),
    });
};

export const useQueryBlogPosts = () => {
    return useQuery({
        queryKey: ["blog"],
        queryFn: ({ signal }) => getFromCloudAPI<BlogPost[]>("blog", {}, signal),
    });
};
