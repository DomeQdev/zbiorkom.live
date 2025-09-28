import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation("Settings");
    const { t: t_groups } = useTranslation("Search");

    const [groups, setGroups] = useState<string[]>(JSON.parse(localStorage.getItem("searchGroupOrdering") || '["vehicles", "stops", "stations", "routes", "relations"]'))
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => () => setDraggedIndex(index);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (index: number) => () => {
        if (draggedIndex === null || draggedIndex === index) return;
        const updated = [...groups];
        const [moved] = updated.splice(draggedIndex, 1);
        updated.splice(index, 0, moved);
        setGroups(updated);
        localStorage.setItem("searchGroupOrdering", JSON.stringify(updated));
        setDraggedIndex(null);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 0.4,
                backgroundColor: "background.paper",
                padding: 2,
            }}
        >
            <h2>{t("searchGroupOrdering")}</h2>
            <List
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {groups.map((group, index) => (
                    <ListItem
                        key={group}
                        draggable
                        onDragStart={handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop(index)}
                        sx={{
                            mb: 1,
                            backgroundColor: "text.primary",
                            borderRadius: 1,
                            cursor: "move",
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 1,
                        }}
                    >
                        <IconButton edge="start" disableRipple aria-label="drag-handle" sx={{color: "background.paper"}}>
                            <DragIndicatorIcon />
                        </IconButton>
                        <ListItemText primary={t_groups(group)} sx={{color: "background.paper"}}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
