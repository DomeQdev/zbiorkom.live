import { ERoute, Route } from "typings";
import { SvgIcon } from "@mui/material";
import Icon from "@/ui/Icon";

type Props = {
    route: Route;
    shortName?: string;
    brigade?: string;
    fontSize?: string;
};

export default ({ route, shortName, brigade, fontSize }: Props) => {
    return (
        <div className="vehicle" style={{ backgroundColor: route[ERoute.color], zIndex: 5, fontSize }}>
            <SvgIcon
                sx={{
                    fontSize: "1.2em",
                    marginRight: "2px",
                }}
            >
                <Icon type={route[ERoute.type]} agency={route[ERoute.agency]} />
            </SvgIcon>
            <b>
                {route[ERoute.name]} {shortName}
            </b>
            {brigade && <span>/{brigade}</span>}
        </div>
    );
};
