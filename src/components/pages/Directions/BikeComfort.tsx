import { useQuery } from "@tanstack/react-query";
import { Location } from "typings";

enum CyclingConditions {
    IDEAL,
    GOOD,
    ACCEPTABLE,
    POOR,
    DANGEROUS,
}

enum WindStrength {
    CALM,
    LIGHT_BREEZE,
    MODERATE_WIND,
    STRONG_WIND,
}

enum WeatherFeature {
    PERFECT_TEMPERATURE,
    GOOD_TEMPERATURE,
    EXTREME_TEMPERATURE,
    RAIN,
    DRIZZLE,
    NO_RAIN,
    LIGHT_WIND,
    MODERATE_WIND,
    STRONG_WIND,
    SUNNY,
    PARTLY_CLOUDY,
    CLOUDY,
}

interface CyclingAnalysisResult {
    conditions: CyclingConditions;
    features: WeatherFeature[];
    windDirection: number;
    windStrength: WindStrength;
    temperature: number;
}

interface OpenMeteoResponse {
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: string;
    };
    hourly: {
        time: string[];
        precipitation: number[];
    };
}

export const analyzeWeatherData = async ([lng, lat]: Location) => {
    const data = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation,cloudcover`
    )
        .then((res) => res.json() as Promise<OpenMeteoResponse>)
        .catch(() => null);

    if (!data) return null;

    const {
        current_weather: { temperature, windspeed, winddirection, weathercode, time },
        hourly,
    } = data;

    const result: CyclingAnalysisResult = {
        conditions: CyclingConditions.IDEAL,
        features: [],
        windDirection: winddirection,
        windStrength: WindStrength.CALM,
        temperature: temperature,
    };

    let score = 10;

    if (temperature >= 15 && temperature <= 25) {
        result.features.push(WeatherFeature.PERFECT_TEMPERATURE);
    } else if ((temperature >= 10 && temperature < 15) || (temperature > 25 && temperature <= 29)) {
        score -= 1;
        result.features.push(WeatherFeature.GOOD_TEMPERATURE);
    } else {
        score -= 5;
        result.features.push(WeatherFeature.EXTREME_TEMPERATURE);
    }

    const currentTimeIndex = hourly.time.findIndex((t) => t.startsWith(time.substring(0, 13)));
    const currentPrecipitation = hourly.precipitation[currentTimeIndex] ?? 0;

    if (currentPrecipitation > 0.5) {
        score -= 6;
        result.features.push(WeatherFeature.RAIN);
    } else if (currentPrecipitation > 0) {
        score -= 3;
        result.features.push(WeatherFeature.DRIZZLE);
    } else {
        result.features.push(WeatherFeature.NO_RAIN);
    }

    if (windspeed < 5) {
        result.windStrength = WindStrength.CALM;
    } else if (windspeed <= 15) {
        result.windStrength = WindStrength.LIGHT_BREEZE;
        result.features.push(WeatherFeature.LIGHT_WIND);
    } else if (windspeed <= 25) {
        result.windStrength = WindStrength.MODERATE_WIND;
        score -= 2;
        result.features.push(WeatherFeature.MODERATE_WIND);
    } else {
        result.windStrength = WindStrength.STRONG_WIND;
        score -= 4;
        result.features.push(WeatherFeature.STRONG_WIND);
    }

    if (weathercode <= 1) {
        result.features.push(WeatherFeature.SUNNY);
    } else if (weathercode === 2) {
        result.features.push(WeatherFeature.PARTLY_CLOUDY);
    } else if (weathercode >= 3) {
        score -= 1;
        result.features.push(WeatherFeature.CLOUDY);
    }

    if (score >= 9) {
        result.conditions = CyclingConditions.IDEAL;
    } else if (score >= 7) {
        result.conditions = CyclingConditions.GOOD;
    } else if (score >= 5) {
        result.conditions = CyclingConditions.ACCEPTABLE;
    } else if (score >= 2) {
        result.conditions = CyclingConditions.POOR;
    } else {
        result.conditions = CyclingConditions.DANGEROUS;
    }

    return result;
};

export default (
    // { weatherData }: { weatherData: CyclingAnalysisResult | null }
) => {
    const { data: weatherData } = useQuery({
        queryKey: ["bike-comfort", "weather"],
        queryFn: () => analyzeWeatherData([21.011889, 52.229837]),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    if (!weatherData) return null;

    return (
        <div>
            <h2>Bike Comfort Analysis</h2>
            <p>Conditions: {CyclingConditions[weatherData.conditions]}</p>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Wind: {WindStrength[weatherData.windStrength]} at {weatherData.windDirection}°</p>
            <p>Features: {weatherData.features.map((f) => WeatherFeature[f]).join(", ")}</p>
        </div>
    );
};
