import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    InputAdornment,
    ListSubheader,
    TextField,
} from "@mui/material";
import { ArrowBack, HighlightOff } from "@mui/icons-material";
import { useRef, useState } from "react";
import { GroupedVirtuoso } from "react-virtuoso";
import { useParams } from "react-router-dom";
import Result from "./Result";
import { useTranslation } from "react-i18next";
import useGoBack from "@/hooks/useGoBack";
import SearchInfo from "./SearchInfo";
import useSearchState from "@/hooks/useSearchState";
import { useQuerySearch } from "@/hooks/useQuerySearch";

export default () => {
    const [expandedStop, setExpandedStop] = useState<string | undefined>();
    const [search, setSearch] = useSearchState("query", "");
    const searchInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslation("Search");
    const { city } = useParams();
    const goBack = useGoBack();

    const { data, isLoading } = useQuerySearch({ city: city!, search });

    return (
        <Dialog
            open
            onClose={() => goBack()}
            fullWidth={window.innerWidth > 600}
            fullScreen={window.innerWidth <= 600}
            sx={(theme) => ({
                "& .MuiDialog-paper": {
                    [theme.breakpoints.up("sm")]: {
                        height: "70%",
                    },
                },
            })}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                    p: 1,
                }}
            >
                <IconButton onClick={() => goBack({ ignoreState: true })}>
                    <ArrowBack />
                </IconButton>
                <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    placeholder="Szukaj"
                    inputRef={searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                        input: {
                            autoComplete: "off",
                            autoCapitalize: "off",
                            endAdornment: (
                                <Fade in={!!search}>
                                    <InputAdornment position="end">
                                        {isLoading ? (
                                            <CircularProgress
                                                sx={{
                                                    color: "text.secondary",
                                                }}
                                                size={20}
                                            />
                                        ) : (
                                            <IconButton
                                                onClick={() => {
                                                    setSearch("");
                                                    searchInput.current?.focus();
                                                }}
                                                edge="end"
                                            >
                                                <HighlightOff />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                </Fade>
                            ),
                        },
                    }}
                />
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                }}
            >
                {!search.length && <SearchInfo />}
                {!!search.length && data?.results && (
                    <GroupedVirtuoso
                        style={{ height: "100%" }}
                        groupCounts={data.groups}
                        groupContent={(index) => (
                            <ListSubheader
                                sx={{
                                    backgroundColor: "transparent",
                                    lineHeight: 3,
                                }}
                                disableSticky
                            >
                                {t(data.groupNames[index])}
                            </ListSubheader>
                        )}
                        itemContent={(index) => (
                            <Result
                                item={data.results[index]}
                                lastItem={index === data.results.length - 1}
                                expandedStop={expandedStop}
                                setExpandedStop={setExpandedStop}
                            />
                        )}
                        components={{
                            TopItemList: (props) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        position: "unset",
                                    }}
                                >
                                    {props.children}
                                </div>
                            ),
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
