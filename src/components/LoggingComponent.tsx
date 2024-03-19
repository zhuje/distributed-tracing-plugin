import { useDataQueries } from "@perses-dev/plugin-system";
import React from "react";

export default function LoggingComponent() {

    const traceResults = useDataQueries('TraceQuery')
    console.log('JZ traceResults : ', traceResults);

    return (
        <h1> Logging Component </h1>
    )
}