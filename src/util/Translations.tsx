import translations from './translations.json';

const Translate = ({ name, replace }: { name: keyof typeof translations["pl"], replace?: any }) => {
    let lang = localStorage.getItem("lang") as keyof typeof translations || "en";
    if(!translations[lang]) lang = "en";
    let res = translations[lang][name];
    if(replace) return <>{res.replace("{{}}", replace)}</>;
    return <>{res}</>;
};

const translate = (name: keyof typeof translations["pl"], replace?: any) => {
    let lang = localStorage.getItem("lang") as keyof typeof translations || "en";
    if(!translations[lang]) lang = "en";
    let res = translations[lang][name];
    if(replace) return res.replace("{{}}", replace);
    return res;
};

export { Translate, translate };