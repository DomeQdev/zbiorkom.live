import { SearchItem } from "typings";
import RouteResult from "./RouteResult";
import StopResult from "./StopResult";
import VehicleResult from "./VehicleResult";
import RelationResult from "./RelationResult";
import StationResult from "./StationResult";

export default ({
    item,
    lastItem,
    expandedStop,
    setExpandedStop,
}: {
    item: SearchItem;
    lastItem?: boolean;
    expandedStop?: string;
    setExpandedStop: (name?: string) => void;
}) => {
    return (
        <div style={{ paddingBottom: lastItem ? 10 : 2 }}>
            <Result item={item} expandedStop={expandedStop} setExpandedStop={setExpandedStop} />
        </div>
    );
};

const Result = ({
    item,
    expandedStop,
    setExpandedStop,
}: {
    item: SearchItem;
    expandedStop?: string;
    setExpandedStop: (name?: string) => void;
}) => {
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
                    isExpanded={expandedStop === item.stop}
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
