interface Stops {
    [key: string]: {
        stops: [{
            stopCode?: string,
            stopDesc?: string,
            stopLat: number,
            stopLon: number,
            stopName?: string,
            stopId: number,
        }]
    }
}
export { Stops };