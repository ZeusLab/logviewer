import "flatpickr/dist/themes/light.css";
import React from "react";
import {
	Button
} from "react-bootstrap";
import {IconContext} from "react-icons";
import {
	BsArrowClockwise,
	BsPlayFill,
} from "react-icons/bs";
import {
	FcCalendar,
} from "react-icons/fc";

import Flatpickr from "react-flatpickr";
import Emitter from './services/emitter';
import DropdownSingleSelection from './DropdownSingleSelection';
import QueryExplanation from "./QueryExplanation";
import moment from "moment";

export const TIME_LAST1HOUR = 1,
	TIME_LAST6HOUR = 6,
	TIME_LAST12HOUR = 12,
	TIME_CUSTOM = 1000;

export const LOG_LEVEL_ALL = 0,
	LOG_LEVEL_DEBUG = 100,
	LOG_LEVEL_INFO = 200,
	LOG_LEVEL_WARN = 300,
	LOG_LEVEL_ERROR = 400,
	LOG_LEVEL_CRITICAL = 500,
	LOG_LEVEL_ALERT = 600,
	LOG_LEVEL_EMERGENCY = 700;
// DEFAULT	(0) The log entry has no assigned severity level.
// DEBUG	(100) Debug or trace information.
// INFO	(200) Routine information, such as ongoing status or performance.
// NOTICE	(300) Normal but significant events, such as start up, shut down, or a configuration change.
// WARNING	(400) Warning events might cause problems.
// ERROR	(500) Error events are likely to cause problems.
// CRITICAL	(600) Critical events cause more severe problems or outages.
// ALERT	(700) A person must take an action immediately.
// EMERGENCY	(800) One or more systems are unusable.

export const LogLevelStr = (logLevel) => {
	switch (logLevel) {
		case LOG_LEVEL_EMERGENCY:
			return "emergency";
		case LOG_LEVEL_ALERT:
			return "alert";
		case LOG_LEVEL_CRITICAL:
			return "critical";
		case LOG_LEVEL_ERROR:
			return "error";
		case LOG_LEVEL_WARN:
			return "warning";
		case LOG_LEVEL_INFO:
			return "info";
		case LOG_LEVEL_DEBUG:
			return "debug";
		case LOG_LEVEL_ALL:
		default:
			return "";
	}
};

export const TimeOptionString = (timeOption, start, end) => {
	switch (timeOption) {
		case TIME_LAST12HOUR:
			return "the last 12 hours";
		case TIME_LAST6HOUR:
			return "the last 6 hours";
		case TIME_CUSTOM:
			const s = moment(start).format('YYYY/MM/DD HH:mm');
			const e = moment(end).format('YYYY/MM/DD HH:mm');
			return `${s} to ${e}`;
		case TIME_LAST1HOUR:
		default:
			return "the last hour";
	}
};

export const DateToYYYYMMDDHHmm = (date) => {
	return moment(date).format("YYYY-MM-DD HH:mm");
};

export default class LogDisplayHeader extends React.Component {
	
	constructor(props) {
		super(props);
		this.logSeverities = [
			{key: LOG_LEVEL_ALL, text: 'Any log level', value: LOG_LEVEL_ALL},
			{key: LOG_LEVEL_DEBUG, text: 'Debug', value: LOG_LEVEL_DEBUG},
			{key: LOG_LEVEL_INFO, text: 'Info', value: LOG_LEVEL_INFO},
			{key: LOG_LEVEL_WARN, text: 'Warning', value: LOG_LEVEL_WARN},
			{key: LOG_LEVEL_ERROR, text: 'Error', value: LOG_LEVEL_ERROR},
			{key: LOG_LEVEL_CRITICAL, text: 'Critical', value: LOG_LEVEL_CRITICAL},
			{key: LOG_LEVEL_ALERT, text: 'Alert', value: LOG_LEVEL_ALERT},
			{key: LOG_LEVEL_EMERGENCY, text: 'Emergency', value: LOG_LEVEL_EMERGENCY},
		];
		this.rangeOfTime = [
			{key: TIME_LAST1HOUR, text: 'Last hour', value: TIME_LAST1HOUR},
			{key: TIME_LAST6HOUR, text: 'Last 6 hours', value: TIME_LAST6HOUR},
			{key: TIME_LAST12HOUR, text: 'Last 12 hours', value: TIME_LAST12HOUR},
			{key: TIME_CUSTOM, text: 'Custom', value: TIME_CUSTOM},
		];
		const now = new Date();
		this.state = {
			tags: [],
			currentTag: undefined,
			currentTimeOption: this.rangeOfTime[0].value,
			currentLogLevel: LOG_LEVEL_ALL,
			startDate: now,
			startDateStr: DateToYYYYMMDDHHmm(now),
			endDate: now,
			endDateStr: DateToYYYYMMDDHHmm(now),
		};
	}
	
	fetchingTag = () => {
		fetch("/api/tag")
			.then(responseMsg => {
				return responseMsg.json();
			})
			.then(responseJson => {
				if (responseJson.code === 200) {
					let arr = [];
					responseJson.data.forEach((item) => {
						arr.push({
							key: item,
							text: item,
							value: item,
						});
					});
					this.setState({
						tags: arr,
					})
				} else {
					/**
					 * alert log
					 */
				}
			})
			.catch(error => {
			})
			.finally(() => {
			})
	};
	
	componentDidMount() {
		this.fetchingTag();
	}
	
	onLogLevelChange = (event, data) => {
		Emitter.emit('query', {
			logLevel: data.value,
		});
		this.setState({
			currentLogLevel: data.value,
		});
	};
	
	onTimeRangeChange = (event, data) => {
		Emitter.emit('query', {
			timeOption: data.value,
		});
		this.setState({
			currentTimeOption: data.value,
		});
	};
	
	onTagChange = (event, data) => {
		Emitter.emit('query', {
			tag: data.value,
		});
		this.setState({
			currentTag: data.value,
		});
	};
	
	onStartTimeSelected = (selectedDates, dateStr, instance) => {
		Emitter.emit('query', {
			startDate: selectedDates[0],
		});
		this.setState({
			startDate: selectedDates[0],
			startDateStr: DateToYYYYMMDDHHmm(selectedDates[0]),
		})
	};
	
	onEndTimeSelected = (selectedDates, dateStr, instance) => {
		Emitter.emit('query', {
			endDate: selectedDates[0],
		});
		this.setState({
			endDate: selectedDates[0],
			endDateStr: DateToYYYYMMDDHHmm(selectedDates[0]),
		})
	}
	
	onRefreshClick = () => {
		Emitter.emit('query', {
			action: 'refresh',
		});
	};
	
	onPlayClick = () => {
		Emitter.emit('query', {
			action: 'play',
		});
	};
	
	render() {
		const {
			tags,
			startDate,
			startDateStr,
			endDate,
			endDateStr,
			currentTag,
			currentTimeOption,
			currentLogLevel,
		} = this.state;
		const offCustomRange = (currentTimeOption !== TIME_CUSTOM);
		const disabled = (currentTag === undefined);
		const maxDate = moment().format("YYYY-MM-DD HH:mm");
		return (
			<div>
				<div className="log-display-header">
					<div className="selection-button float-left">
						<DropdownSingleSelection
							placeHolder="Select application"
							onChange={this.onTagChange}
							value={currentTag}
							options={tags}/>
					</div>
					<div className="selection-button float-left">
						<DropdownSingleSelection
							placeHolder="Select log level"
							value={currentLogLevel}
							disabled={disabled}
							onChange={this.onLogLevelChange}
							options={this.logSeverities}/>
					</div>
					<div className="dropdown-area float-left">
						<DropdownSingleSelection
							placeHolder="Select time"
							value={currentTimeOption}
							disabled={disabled}
							onChange={this.onTimeRangeChange}
							options={this.rangeOfTime}/>
					</div>
					<div className="dropdown-area float-left" hidden={offCustomRange}>
						<div className="dropdown-button dropdown">
							<Flatpickr
								data-enable-time
								value={startDateStr}
								options={{
									dateFormat: "Y-m-d H:i",
									maxDate: maxDate,
								}}
								onChange={this.onStartTimeSelected}
							/>
							<FcCalendar/>
						</div>
					</div>
					<div className="dropdown-area float-left" hidden={offCustomRange}>
						<div className="dropdown-button dropdown">
							<Flatpickr
								data-enable-time
								value={endDateStr}
								options={{
									dateFormat: "Y-m-d H:i",
									maxDate: maxDate,
								}}
								onChange={this.onEndTimeSelected}
							/>
							<FcCalendar/>
						</div>
					</div>
					<div className="control-area float-right">
						<IconContext.Provider value={{className: 'icon refresh'}}>
							<Button onClick={this.onRefreshClick} variant="link" size="sm" className="zero-padding">
								<BsArrowClockwise/>
							</Button>
						</IconContext.Provider>
						<IconContext.Provider value={{className: 'icon stream'}} size="sm">
							<Button onClick={this.onPlayClick} variant="link" className="zero-padding">
								<BsPlayFill/>
							</Button>
						</IconContext.Provider>
					</div>
				</div>
				
				<div className="header-toolbar">
					<QueryExplanation
						tag={currentTag}
						logLevel={currentLogLevel}
						startTime={startDate}
						endTime={endDate}
						timeOption={currentTimeOption}/>
					<div className="actions">
						<Button variant="link" className="zero-padding"><b>Download logs</b></Button>
					</div>
				</div>
			</div>
		
		);
	}
}