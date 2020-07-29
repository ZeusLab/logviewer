import React from "react";
import {LogLevelStr, TimeOptionString} from "./LogDisplayHeader";
import moment from "moment";

function QueryExplanation(props) {
    const logLevel = LogLevelStr(props.logLevel);
    const {
        startTime,
        endTime
    } = props;
    const timeOption = TimeOptionString(props.timeOption, startTime, endTime);
    const tag = props.tag;
    if (tag === undefined || tag === "") {
        return (
            <div className="query-explanation">
                <span/>
            </div>
        )
    }
    const now = moment().format('MMMM Do YYYY, HH:mm:ss');
    const str = `Showing <b>${logLevel}</b> log messages of <b>${tag}</b> from <b>${timeOption}</b> at ${now}`;
    return (
        <div className="query-explanation">
            <div dangerouslySetInnerHTML={{__html: str}}/>
        </div>
    )
}

export default QueryExplanation;