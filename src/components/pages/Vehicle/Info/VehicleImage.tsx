import { Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default ({ hash, imageHeight }: { hash: string; imageHeight: number }) => {
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [image, setImage] = useState<string>();
    const [author, setAuthor] = useState<string>();

    useEffect(() => {
        if (!hash) return;

        fetch(`${Gay.cloudBase}/getImageByHash?hash=${hash}`)
            .then(async (response) => {
                if (response.status === 200) {
                    const blob = await response.blob();
                    setImage(URL.createObjectURL(blob));

                    setAuthor(decodeURIComponent(atob(response.headers.get("x-author")!)));
                } else {
                    setImageLoading(false);
                }
            })
            .catch(() => {
                setImageLoading(false);
            });
    }, [hash]);

    return (
        <>
            {imageLoading && (
                <Skeleton
                    variant="rectangular"
                    height={imageHeight}
                    sx={{
                        borderRadius: 2,
                        margin: 2,
                    }}
                />
            )}

            {image && (
                <img
                    src={image}
                    alt="vehicle image"
                    onLoad={() => setImageLoading(false)}
                    style={{
                        width: "calc(100% - 40px)",
                        height: "auto",
                        display: "block",
                        borderRadius: 24,
                        margin: 20,
                        marginBottom: 5,
                    }}
                />
            )}

            {author && (
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        color: "lightgrey",
                        textAlign: "right",
                        marginBottom: 1,
                        marginRight: 3,
                    }}
                >
                    &copy; {author}
                </Typography>
            )}
        </>
    );
};
