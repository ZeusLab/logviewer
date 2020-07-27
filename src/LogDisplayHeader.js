import React from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {IconContext} from "react-icons";
import {
    BsArrowClockwise,
    BsPlayFill,
} from "react-icons/bs";

export const TIME_LAST1HOUR = 1,
    TIME_LAST6HOUR = 6,
    TIME_LAST12HOUR = 12,
    TIME_CUSTOM = 999;

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
            currentDate: undefined,
            currentRefreshConfig: 0,
            histories: []
        };
    }

    fetchingHistories = (tag) => {
        fetch("/api/histories?tag=" + tag)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.code === 200) {
                    this.setState({
                        currentDate: undefined,
                        histories: responseJson.data,
                    });
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
        const application = this.props.application;
        this.fetchingHistories(application);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.application !== prevProps.application) {
            this.setState({
                currentRefreshConfig: 0,
            });
            this.fetchingHistories(this.props.application);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.application !== state.application) {
            return {
                application: props.application,
            };
        }
        return null;
    }

    onLogLevelSelected = (eventKey, eventObject) => {

    }

    onApplicationSelected = (eventKey, eventOpbject) => {

    }

    onRefreshClick = () => {
        console.log('click refresh');
    }

    render() {
        let applicationTitle = "Select application"
        let logSeverityTitle = this.logSeverities[0].value;
        let rangeTitle = this.rangeOfTime[0].value;
        return (
            <div className="header">
                <div className="dropdown-area">
                    <DropdownButton id="dropdown-basic-button"
                                    className="float-left"
                                    title={applicationTitle}
                                    onSelect={this.onApplicationSelected}>
                    </DropdownButton>
                </div>
                <div className="dropdown-area">
                    <DropdownButton id="dropdown-basic-button"
                                    className="float-left"
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
                <div className="dropdown-area">
                    <DropdownButton id="dropdown-basic-button"
                                    className="float-left"
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

                <div className="control-area">
                    <IconContext.Provider value={{className: 'icon refresh'}}>
                        <button onClick={this.onRefreshClick}>
                            <BsArrowClockwise/>
                        </button>
                    </IconContext.Provider>

                    <IconContext.Provider value={{className: 'icon stream'}}>
                        <button onClick={this.onRefreshClick}>
                            <BsPlayFill/>
                        </button>
                    </IconContext.Provider>
                </div>
            </div>
        );
    }
}