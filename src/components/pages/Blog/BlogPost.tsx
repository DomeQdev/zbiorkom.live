import { Box, DialogContent, DialogTitle, IconButton, LinearProgress, Typography } from "@mui/material";
import { useQueryBlogPost } from "@/hooks/useQueryBlog";
import { ArrowBack, Share } from "@mui/icons-material";
import { memo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useGoBack from "@/hooks/useGoBack";
import Sticky from "@/ui/Sticky";
import Helm from "@/util/Helm";
import { share } from "@/util/tools";

export default memo(() => {
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const { id } = useParams();
    const goBack = useGoBack();

    const { data, error, isLoading } = useQueryBlogPost({ id: id! });

    useEffect(() => {
        if (error) goBack();
    }, [error]);

    return (
        <>
            {data && (
                <Helm variable="blogPost" dictionary={{ title: data.title, description: data.description }} />
            )}

            <Sticky scrollContainer={scrollContainer} element={elementRef} offset={32}>
                {(percent) => (
                    <DialogTitle
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            boxShadow:
                                percent > 0.5
                                    ? "0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                                    : undefined,
                            transition: "box-shadow .3s",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                overflow: "hidden",
                            }}
                        >
                            <IconButton onClick={() => goBack({ ignoreState: true })}>
                                <ArrowBack />
                            </IconButton>
                            <span
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    opacity: percent,
                                }}
                            >
                                {data?.title}
                            </span>
                        </Box>
                        <IconButton onClick={() => share(window.location.href)}>
                            <Share />
                        </IconButton>
                    </DialogTitle>
                )}
            </Sticky>

            {isLoading && <LinearProgress />}

            <DialogContent sx={{ p: 0 }} ref={scrollContainer}>
                <Box className="blogContent">
                    <Typography
                        variant="h1"
                        ref={elementRef}
                        sx={{
                            padding: "16px",
                            marginBottom: "16px",
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {data?.title}
                    </Typography>

                    <img src={data?.image} alt={data?.title} style={{ width: "100%" }} />
                </Box>

                {data?.content && (
                    <div className="blogContent" dangerouslySetInnerHTML={{ __html: data.content }} />
                )}
            </DialogContent>
        </>
    );
});
