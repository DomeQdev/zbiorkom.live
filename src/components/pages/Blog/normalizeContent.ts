import { logoPath } from "@/ui/Icon";

export default (content: string) => {
    const svgLogo = `<svg width="60" height="60" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="${logoPath}" /></svg>`;
    const customHr = `<div class="hr"><hr>${svgLogo}<hr></div>`;

    return content.replaceAll("<hr/>", customHr);
};
