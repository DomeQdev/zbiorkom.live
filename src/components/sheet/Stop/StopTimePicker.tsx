import { useState } from "react";
import useStopStore from "@/hooks/useStopStore";
import TimePicker from "@/ui/TimePicker";

export default () => {
    const stopStore = useStopStore((state) => state);
    const [time, setTime] = useState<number>(stopStore.time || Date.now());

    return (
        <TimePicker
            value={time}
            onChange={(time) => {
                setTime(time);
                stopStore.setTime(time);
            }}
        />
    );
};
