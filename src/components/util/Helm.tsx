import { $Dictionary } from "i18next/typescript/helpers";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cities from "cities";

export default ({ variable, dictionary }: { variable: string; dictionary?: $Dictionary }) => {
    const { t } = useTranslation("Seo");
    const city = useParams().city;
    const cityData = cities[city!];

    const updatedDictionary = {
        ...dictionary,
        city: cityData?.name || city,
    };

    const title = t(`${variable}.title`, updatedDictionary);
    const description = t(`${variable}.description`, updatedDictionary);

    const hasDescription = description !== `${variable}.description`;

    return (
        <Helmet>
            <title>zbiorkom.live - {title}</title>
            <meta property="og:title" content={`zbiorkom.live - ${title}`} />

            {hasDescription && <meta name="description" content={description} />}
            {hasDescription && <meta property="og:description" content={description} />}
        </Helmet>
    );
};
