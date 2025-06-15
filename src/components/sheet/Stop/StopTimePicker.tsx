import { useState } from "react";
import TimePicker from "@ui/TimePicker";
import useStopStore from "@/hooks/useStopStore";

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
