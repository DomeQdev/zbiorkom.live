import { ERoute, Route } from "typings";
import Icon from "./Icon";

type Props = {
    route: Route;
    style?: React.CSSProperties;
    onClick?: () => void;
};

export default ({ route, style, onClick }: Props) => {
    return (
        <div
            className="routeChip"
            style={{ backgroundColor: route[ERoute.color], ...style }}
            onClick={onClick}
        >
            <svg viewBox="0 0 24 24" width="1.1em" fill="currentColor">
                <Icon type={route[ERoute.type]} agency={route[ERoute.agency]} />
            </svg>

            {route[ERoute.name]}
        </div>
    );
};
