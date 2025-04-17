import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export type SearchState = [string, (newValue: string) => void];

export default (key: string, initialValue?: string): SearchState => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [value, setStateValue] = useState<string>(() => {
        const paramValue = searchParams.get(key);
        return paramValue ? paramValue : initialValue || "";
    });

    useEffect(() => {
        if (value) {
            searchParams.set(key, value);
        } else {
            searchParams.delete(key);
        }
        setSearchParams(searchParams, { replace: true });
    }, [value, key]);

    const setValue = (newValue: string) => {
        setStateValue(newValue);
    };

    return [value, setValue];
};
