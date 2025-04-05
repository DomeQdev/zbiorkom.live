import { ButtonBase, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { BlogPost } from "typings";
import { Link } from "react-router-dom";
import { memo } from "react";

export default memo(({ post }: { post: BlogPost }) => {
    return (
        <ButtonBase
            component={Link}
            to={post.id}
            sx={{
                borderRadius: 2,
                textAlign: "left",
                height: "max-content",
                "&.MuiTouchRipple-root": {
                    height: "max-content",
                },
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    height: 380,
                    backgroundColor: "background.paper",
                    transition: "background-color .3s cubic-bezier(.2,0,0,1)",
                    borderRadius: 2,
                    "&:hover": {
                        backgroundColor: "primary.main",
                    },
                }}
            >
                <CardMedia
                    image={post.image}
                    title={post.title}
                    sx={{
                        height: 220,
                        borderRadius: 2,
                    }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {post.date} · {post.description}
                    </Typography>
                </CardContent>
            </Card>
        </ButtonBase>
    );
});
