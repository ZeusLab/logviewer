import React from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {IconContext} from "react-icons";
import {
    BsSearch,
    BsCloudDownload,
} from "react-icons/bs";

export const ACTION_TAIL = "tail";
export const ACTION_HEAD = "head";

export default class LogDisplayHeader extends React.Component {

    constructor(props) {
        super(props);
        this.refreshConfig = [
            {
                key: 0,
                value: "Off",
            },
            {
                key: 1,
                value: "every second",
            },
            {
                key: 5,
                value: "every 5 seconds",
            },
            {
                key: 10,
                value: "every 10 seconds",
            },
            {
                key: 15,
                value: "every 15 seconds",
            },
            {
                key: 30,
                value: "every 30 seconds",
            },
            {
                key: 60,
                value: "every 60 seconds",
            }
        ];
        this.actions = [
            {
                key: ACTION_TAIL,
                value: "Tail"
            },
            {
                key: ACTION_HEAD,
                value: "Head"
            }
        ];
        this.state = {
            currentDate: undefined,
            currentRefreshConfig: 0,
            currentAction: this.actions[0].key,
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
        console.log('select date key ' + eventKey + ' of application ' + this.props.application);
        this.setState({
            currentDate: eventKey,
        });
        this.props.onDateSelected(eventKey, eventObject);
    };

    onTimeRefreshSelected = (eventKey, eventObject) => {
        console.log('select refresh time key ' + eventKey);
        this.setState({
            currentRefreshConfig: parseInt(eventKey, 10),
        });
        this.props.onRefreshConfigSelected(eventKey, eventObject);
    };

    onActionSelected = (eventKey, eventObject) => {
        console.log('select action ' + eventKey);
        this.setState({
            currentAction: eventKey,
        });
        this.props.onActionSelected(eventKey, eventObject);
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

        const currentAction = this.state.currentAction;
        let valueOfAction = this.actions[0].value;
        this.actions.forEach(value => {
            if (value.key === currentAction) {
                valueOfAction = value.value;
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

                    <DropdownButton id="dropdown-basic-button"
                                    className="float-left action"
                                    title={valueOfAction}
                                    onSelect={this.onActionSelected}>
                        {this.actions.map((value, index) => {
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