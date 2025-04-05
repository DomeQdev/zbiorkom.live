// import useFavStore from "@/hooks/useFavStore";
// import { Box, IconButton, SvgIcon } from "@mui/material";
// import { useShallow } from "zustand/react/shallow";

// export default ({ stop }: { stop: PartialStop }) => {
//     const favorite = useFavStore(useShallow((state) => state.favorites.find((fav) => fav.id === stop.id)));

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: 1,
//                 marginX: 1,
//             }}
//         >
//             {true && (
//                 <IconButton
//                     size="small"
//                     sx={{
//                         backgroundColor: "background.paper",
//                         padding: 1,
//                         "& .MuiSvgIcon-root": {
//                             width: 20,
//                             height: 20,
//                         },
//                     }}
//                 >
//                     <FilterStar />
//                 </IconButton>
//             )}
//         </Box>
//     );
// };

// const FilterStar = () => (
//     <SvgIcon viewBox="0 0 24 24">
//         <path d="M9.262 21.575q-.509 0-.853-.344t-.344-.853v-7.181L1.122 4.34Q.673 3.742.987 3.083t1.092-.658h16.757q.778 0 1.092.658t-.135 1.257l-6.941 8.857v7.182q0 .509-.344.853t-.853.344zm1.197-9.216 5.925-7.541H4.534zm0 0" />
//         <path d="m15.686 21.095.78-3.372-2.616-2.268 3.456-.3 1.344-3.18 1.344 3.18 3.456.3-2.616 2.268.78 3.372-2.964-1.788z" />
//     </SvgIcon>
// );
