import React from "react";
import {LogLevelStr, TimeOptionString} from "./LogDisplayHeader";
import moment from "moment";

function QueryExplanation(props) {
	const logLevel = LogLevelStr(props.logLevel);
	const timeOption = TimeOptionString(props.timeOption);
	const tag = props.tag;
	if (tag === undefined || tag === "") {
		return (
			<div className="query-explanation">
				<span/>
			</div>
		)
	}
	const now = moment().format('MMMM Do YYYY, h:mm:ss a');
	const str = `Showing <b>${logLevel}</b> log messages of <b>${tag}</b> logs from <b>${timeOption}</b> at ${now}`;
	return (
		<div className="query-explanation">
			<div dangerouslySetInnerHTML={{__html: str}}/>
		</div>
	)
}

export default QueryExplanation;