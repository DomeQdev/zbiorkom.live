export default (time: number) =>
    new Date(time).toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
