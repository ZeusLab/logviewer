import "flatpickr/dist/themes/light.css";
import React from "react";
import {
    Dropdown,
    DropdownButton,
    Button
} from "react-bootstrap";
import {
    FcCalendar,
} from "react-icons/fc";

import Flatpickr from "react-flatpickr";
import Emitter from './services/emitter';
import DropdownMultipleSelection from './DropdownMultipleSelection';
import DropdownSingleSelection from './DropdownSingleSelection';

export const TIME_LAST1HOUR = "1",
    TIME_LAST6HOUR = "6",
    TIME_LAST12HOUR = "12",
    TIME_CUSTOM = "999";

export const LOG_LEVEL_ALL = "ALL",
    LOG_LEVEL_DEBUG = "DEBUG",
    LOG_LEVEL_INFO = "INFO",
    LOG_LEVEL_WARN = "WARN",
    LOG_LEVEL_ERROR = "ERROR",
    LOG_LEVEL_FATAL = "FATAL";


export default class LogDisplayHeader extends React.Component {

    constructor(props) {
        super(props);
        this.logSeverities = [
            {
                key: LOG_LEVEL_ALL,
                value: "Any log level"
            },
            {
                key: LOG_LEVEL_DEBUG,
                value: "Debug"
            },
            {
                key: LOG_LEVEL_INFO,
                value: "Info"
            },
            {
                key: LOG_LEVEL_WARN,
                value: "Warning"
            },
            {
                key: LOG_LEVEL_ERROR,
                value: "Error"
            },
            {
                key: LOG_LEVEL_FATAL,
                value: "Fatal"
            }
        ];
        this.rangeOfTime = [
            {
                key: TIME_LAST1HOUR,
                value: "Last hour"
            },
            {
                key: TIME_LAST6HOUR,
                value: "Last 6 hour"
            },
            {
                key: TIME_LAST12HOUR,
                value: "Last 12 hour"
            },
            {
                key: TIME_CUSTOM,
                value: "Custom"
            }
        ];
        this.state = {
            tags: [],
            currentTag: undefined,
            timeOption: this.rangeOfTime[0].value,
            date: new Date()
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

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.application !== prevProps.application) {
    //         this.setState({
    //             currentRefreshConfig: 0,
    //         });
    //         this.fetchingHistories(this.props.application);
    //     }
    // }
    //
    // static getDerivedStateFromProps(props, state) {
    //     if (props.application !== state.application) {
    //         return {
    //             application: props.application,
    //         };
    //     }
    //     return null;
    // }

    onLogLevelSelected = (eventKey, eventObject) => {
        Emitter.emit('LogLevel', eventKey);
    };

    onApplicationSelected = (eventKey, eventOpbject) => {
    };

    onTimeRangeChanged = (value) => {
    };

    onRefreshClick = () => {
    };

    onPlayClick = () => {
    };

    handleEvent(event, picker) {
        console.log(picker.startDate);
    }

    handleCallback(start, end, label) {
        console.log(start, end, label);
    }

    render() {
        let applicationTitle = "Select application"
        let logSeverityTitle = this.logSeverities[0].value;
        let rangeTitle = this.rangeOfTime[0].value;
        const tags = this.state.tags;
        const {date} = this.state;
        return (
            <div>
                <div className="log-display-header">
                    <div className="dropdown-area float-left">
                        <DropdownButton id="dropdown-basic-button"
                                        className="dropdown-button"
                                        title={applicationTitle}
                                        onSelect={this.onApplicationSelected}>
                            {tags.map((value, index) => {
                                return (
                                    <Dropdown.Item key={value}
                                                   eventKey={value}>
                                        {value}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                        <DropdownSingleSelection options={tags}/>
                        <DropdownMultipleSelection/>
                    </div>
                    <div className="dropdown-area float-left">
                        <DropdownButton id="dropdown-basic-button"
                                        className="dropdown-button"
                                        title={logSeverityTitle}
                                        onSelect={this.onLogLevelSelected}>
                            {this.logSeverities.map((value, index) => {
                                return (
                                    <Dropdown.Item key={value.key}
                                                   eventKey={value.key}>
                                        {value.value}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                    </div>
                    <div className="dropdown-area float-left">
                        <DropdownButton id="dropdown-basic-button"
                                        className="dropdown-button"
                                        title={rangeTitle}
                                        onSelect={this.onApplicationSelected}>
                            {this.rangeOfTime.map((value, index) => {
                                return (
                                    <Dropdown.Item key={value.key}
                                                   eventKey={value.key}>
                                        {value.value}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                    </div>
                    <div className="dropdown-area float-left">
                        <div className="dropdown-button dropdown">
                            <Flatpickr
                                data-enable-time
                                value={date}
                                onChange={date => {
                                    this.setState({date});
                                }}
                            />
                            <FcCalendar/>
                        </div>
                    </div>
                    {/*<div className="dropdown-area float-left">*/}
                    {/*    <div className="dropdown-button dropdown">*/}
                    {/*        <Flatpickr*/}
                    {/*            data-enable-time*/}
                    {/*            value={date}*/}
                    {/*            onChange={date => {*/}
                    {/*                this.setState({date});*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*        <FcCalendar/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="control-area float-right">*/}
                    {/*    <IconContext.Provider value={{className: 'icon refresh'}}>*/}
                    {/*        <Button onClick={this.onRefreshClick} variant="link" size="sm" className="zero-padding">*/}
                    {/*            <BsArrowClockwise/>*/}
                    {/*        </Button>*/}
                    {/*    </IconContext.Provider>*/}
                    {/*    <IconContext.Provider value={{className: 'icon stream'}} size="sm">*/}
                    {/*        <Button onClick={this.onPlayClick} variant="link" className="zero-padding">*/}
                    {/*            <BsPlayFill/>*/}
                    {/*        </Button>*/}
                    {/*    </IconContext.Provider>*/}
                    {/*</div>*/}
                </div>

                <div className="header-toolbar">
                    <div className="query-explanation">
                        <span>Showing logs from <b>the last hour</b> at 11:01 AM (EDT)</span>
                    </div>
                    <div className="actions">
                        <Button variant="link" className="zero-padding"><b>Download logs</b></Button>
                    </div>
                </div>
            </div>

        );
    }
}