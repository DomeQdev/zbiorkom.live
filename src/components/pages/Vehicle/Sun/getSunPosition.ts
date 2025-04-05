const PI = Math.PI;
const rad = PI / 180;
const dayMs = 1000 * 60 * 60 * 24;
const e = rad * 23.4397;

export default (lng: number, lat: number) => {
    const lw = rad * -lng;
    const phi = rad * lat;
    const d = toDays(Date.now());

    const M = solarMeanAnomaly(d);
    const L = eclipticLongitude(M);
    const dec = declination(L);
    const ra = rightAscension(L);
    const th = siderealTime(d, lw);
    const H = th - ra;

    const azimuthDegrees = (azimuth(H, phi, dec) * 180) / PI + 180;

    return (azimuthDegrees + 360) % 360;
};

const toJulian = (date: number) => date / dayMs - 0.5 + 2440588;

const toDays = (date: number) => toJulian(date) - 2451545;

const solarMeanAnomaly = (d: number) => rad * (357.5291 + 0.98560028 * d);

const eclipticLongitude = (M: number) => {
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372;
    return M + C + P + PI;
};

const declination = (L: number) => Math.asin(Math.sin(e) * Math.sin(L));

const rightAscension = (L: number) => Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));

const siderealTime = (d: number, lw: number) => rad * (280.16 + 360.9856235 * d) - lw;

const azimuth = (H: number, phi: number, dec: number) => {
    return Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
};
