import { EStop, SearchItem } from "typings";
import RouteResult from "./RouteResult";
import StopResult from "./StopResult";
import VehicleResult from "./VehicleResult";
import RelationResult from "./RelationResult";
import StationResult from "./StationResult";

type Props = {
    item: SearchItem;
    lastItem?: boolean;
    expandedStop?: string;
    setExpandedStop: (name?: string) => void;
};

export default ({ item, lastItem, expandedStop, setExpandedStop }: Props) => {
    return (
        <div style={{ paddingBottom: lastItem ? 10 : 2 }}>
            <Result item={item} expandedStop={expandedStop} setExpandedStop={setExpandedStop} />
        </div>
    );
};

const Result = ({ item, expandedStop, setExpandedStop }: Props) => {
    switch (true) {
        case !!item.route:
            return (
                <RouteResult route={item.route} borderTop={item.borderTop} borderBottom={item.borderBottom} />
            );
        case !!item.stop:
            return (
                <StopResult
                    stop={item.stop}
                    borderTop={item.borderTop}
                    borderBottom={item.borderBottom}
                    isExpanded={expandedStop === item.stop[EStop.id]}
                    setExpandedStop={setExpandedStop}
                />
            );
        case !!item.station:
            return (
                <StationResult
                    station={item.station}
                    borderTop={item.borderTop}
                    borderBottom={item.borderBottom}
                />
            );
        case !!item.vehicle:
            return (
                <VehicleResult
                    vehicle={item.vehicle}
                    borderTop={item.borderTop}
                    borderBottom={item.borderBottom}
                />
            );
        case !!item.relation:
            return (
                <RelationResult
                    relation={item.relation}
                    borderTop={item.borderTop}
                    borderBottom={item.borderBottom}
                />
            );
        default:
            return null;
    }
};
