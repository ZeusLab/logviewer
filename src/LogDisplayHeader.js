import React from "react";
import {
    Dropdown,
    DropdownButton,
    Button
} from "react-bootstrap";
import {
    DateTimePicker,
    Picklist,
    PicklistOption
} from 'react-rainbow-components';
import {IconContext} from "react-icons";
import {
    BsArrowClockwise,
    BsPlayFill,
} from "react-icons/bs";

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
    state = {
        value: {name: 'option 6', label: 'Central Park'}
    }

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
        ]
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
        ]
        this.state = {
            tags: [],
            currentTag: undefined,
            timeOption: this.rangeOfTime[0].value,
        };
    }

    fetchingTag = () => {
        // fetch("/api/tag")
        //     .then(responseMsg => {
        //         return responseMsg.json();
        //     })
        //     .then(responseJson => {
        //         if (responseJson.code === 200) {
        //             let arr = [];
        //             responseJson.data.forEach((item) => {
        //                 arr.push(item);
        //             });
        //             this.setState({
        //                 tags: arr,
        //             })
        //         } else {
        //             /**
        //              * alert log
        //              */
        //         }
        //     })
        //     .catch(error => {
        //     })
        //     .finally(() => {
        //     })
    };

    // componentDidMount() {
    //     this.fetchingTag();
    // }

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

    }

    onApplicationSelected = (eventKey, eventOpbject) => {

    }

    onTimeRangeChanged = (value) => {
    }

    onRefreshClick = () => {

    }

    onPlayClick = () => {

    }

    render() {
        let applicationTitle = "Select application"
        let logSeverityTitle = this.logSeverities[0].value;
        let rangeTitle = this.rangeOfTime[0].value;
        const tags = this.state.tags;
        return (
            <React.Fragment>
                <div className="log-display-header">
                    <div className="dropdown-area float-left">
                        <DropdownButton id="dropdown-basic-button"
                                        className="dropdown-float-left"
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
                    </div>
                    <div className="dropdown-area float-left">
                        <DropdownButton id="dropdown-basic-button"
                                        className="dropdown-float-left"
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
                                        className="dropdown-float-left"
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
                        <Picklist
                            id="picklist-1"
                            placeholder="Choose Building"
                            label="Select Building"
                            value={this.state.value}
                            hideLabel>
                            <PicklistOption name="option 1" label="All Buildings"/>
                            <PicklistOption name="option 2" label="New Building"/>
                            <PicklistOption name="header" label="Your Buildings" variant="header"/>
                            <PicklistOption name="option 3" label="Experimental"/>
                            <PicklistOption name="option 4" label="Bennet Towers"/>
                            <PicklistOption name="option 5" label="Empire State"/>
                            <PicklistOption name="option 6" label="Central Park"/>
                            <PicklistOption name="option 7" label="Chrysler"/>
                            <PicklistOption name="option 8" label="Plaza"/>
                        </Picklist>
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
                    <div className="query-explanation">
                        <span>Showing logs from <b>the last hour</b> at 11:01 AM (EDT)</span>
                    </div>
                    <div className="actions">
                        <Button variant="link" className="zero-padding"><b>Download logs</b></Button>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}