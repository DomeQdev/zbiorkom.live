import { Box, DialogContent, DialogTitle, IconButton, Skeleton, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import Sticky from "@/ui/Sticky";
import Helm from "@/util/Helm";
import { useQueryBlogPosts } from "@/hooks/useQueryBlog";

export default memo(() => {
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation("Blog");
    const navigate = useNavigate();

    const { data } = useQueryBlogPosts();

    return (
        <>
            <Helm variable="blogPosts" />

            <Sticky scrollContainer={scrollContainer} element={elementRef}>
                {(percent) => (
                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            boxShadow:
                                percent > 0.5
                                    ? "0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                                    : undefined,
                            transition: "box-shadow .3s",
                        }}
                        variant="body1"
                    >
                        <IconButton onClick={() => navigate(window.location.pathname, { state: "menu" })}>
                            <Menu />
                        </IconButton>
                        <span style={{ opacity: percent }}>{t("blog")}</span>
                    </DialogTitle>
                )}
            </Sticky>

            <DialogContent
                ref={scrollContainer}
                sx={
                    !data
                        ? {
                              pointerEvents: "none",
                              overflow: "hidden",
                          }
                        : undefined
                }
            >
                <Typography
                    variant="h5"
                    fontWeight="500"
                    ref={elementRef}
                    sx={{
                        padding: "16px",
                        marginBottom: "16px",
                    }}
                >
                    {t("blog")}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 2,
                        flexGrow: 0,
                    }}
                >
                    {data && data?.map((post) => <BlogCard key={post.id} post={post} />)}
                    {!data &&
                        new Array(3).fill(0).map((_, i) => (
                            <Skeleton
                                sx={{
                                    height: 380,
                                    borderRadius: 2,
                                }}
                                variant="rectangular"
                                key={`skelet${i}`}
                            />
                        ))}
                </Box>
            </DialogContent>
        </>
    );
});
