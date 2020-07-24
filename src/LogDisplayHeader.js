import React from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {IconContext} from "react-icons";
import {
    BsSearch,
    BsCloudDownload,
} from "react-icons/bs";

export const REFRESH_OFF = 0,
    REFRESH_5SECS = 5,
    REFRESH_10SECS = 10,
    REFRESH_15SECS = 15,
    REFRESH_30SECS = 30,
    REFRESH_60SECS = 60;

export default class LogDisplayHeader extends React.Component {

    constructor(props) {
        super(props);
        this.refreshConfig = [
            {
                key: REFRESH_OFF,
                value: "Off",
            },
            {
                key: REFRESH_5SECS,
                value: "every 5 seconds",
            },
            {
                key: REFRESH_10SECS,
                value: "every 10 seconds",
            },
            {
                key: REFRESH_15SECS,
                value: "every 15 seconds",
            },
            {
                key: REFRESH_30SECS,
                value: "every 30 seconds",
            },
            {
                key: REFRESH_60SECS,
                value: "every 60 seconds",
            }
        ];
        this.state = {
            currentDate: undefined,
            currentRefreshConfig: REFRESH_OFF,
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
                currentRefreshConfig: REFRESH_OFF,
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

    onDateSelected = (eventKey, eventObject) => {
        this.setState({
            currentDate: eventKey,
            currentRefreshConfig: REFRESH_OFF,
        });
        this.props.onDateSelected(eventKey, eventObject);
    };

    onTimeRefreshSelected = (eventKey, eventObject) => {
        if (eventKey === undefined || !eventKey) {
            eventKey = REFRESH_OFF
        }
        this.setState({
            currentRefreshConfig: parseInt(eventKey, 10),
        });
        this.props.onRefreshConfigSelected(eventKey, eventObject);
    };

    render() {
        const histories = this.state.histories;
        const currentKey = this.state.currentDate === undefined ? "Select date" : this.state.currentDate;
        let title = currentKey;
        histories.forEach(value => {
            if (value.key === currentKey) {
                title = value.value;
            }
        });
        const currentRefreshTime = this.state.currentRefreshConfig;
        let valueOfRefreshConfig = this.refreshConfig[0].value;
        this.refreshConfig.forEach(value => {
            if (value.key === currentRefreshTime) {
                valueOfRefreshConfig = value.value;
            }
        });
        return (
            <div className="header">
                <div className="date-area">
                    <span className="float-left">Date </span>
                    <DropdownButton id="dropdown-basic-button"
                                    className="float-left"
                                    title={title}
                                    onSelect={this.onDateSelected}>
                        {histories.map((value, index) => {
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
                    <IconContext.Provider value={{className: 'icon search'}}>
                        <React.Fragment>
                            <BsSearch/>
                        </React.Fragment>
                    </IconContext.Provider>

                    <IconContext.Provider value={{className: 'icon download'}}>
                        <React.Fragment>
                            <BsCloudDownload/>
                        </React.Fragment>
                    </IconContext.Provider>

                    <div className="refresh-area">
                        <DropdownButton id="dropdown-basic-button"
                                        className="float-right"
                                        title={valueOfRefreshConfig}
                                        onSelect={this.onTimeRefreshSelected}>
                            {this.refreshConfig.map((value, index) => {
                                return (
                                    <Dropdown.Item key={value.key}
                                                   eventKey={value.key}>
                                        {value.value}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                    </div>
                </div>
            </div>
        );
    }
}