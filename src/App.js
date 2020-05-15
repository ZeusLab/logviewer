import React, {PureComponent} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Dropdown,
    DropdownButton,
} from 'react-bootstrap';
import './App.css';
import chainedFunction from 'chained-function';
import BootstrapTable from 'react-bootstrap-table-next';
import "./index.styl";

class MenuItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    handleSelect = (event) => {
        const {
            isSelected,
            appName,
            onAppSelected,
            ...props
        } = this.props;
        if (isSelected) {
            event.preventDefault();
            return;
        }
        onAppSelected(appName);
    };

    render() {
        const {
            onClick,
            appName,
            isSelected,
            ...props
        } = this.props;

        const classNames = isSelected ? "sidenav-navitem highlighted" : "sidenav-navitem";
        return (
            <div className={classNames}
                 onClick={chainedFunction(onClick, this.handleSelect)}>
                <div className="navitem">{appName}</div>
            </div>
        )
    }
}

class LeftMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            currentApp: undefined,
        };
        this.onAppSelected = this.props.onAppSelected;
        this.currentApp = undefined;
    }

    onItemClick = (application) => {
        this.setState({
            currentApp: application,
        });
        this.onAppSelected(application);
    };

    fetchingListOfApp = () => {
        fetch("/application")
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code === 200) {
                    this.onItemClick(responseJson.data[0]);
                    let arr = [];
                    responseJson.data.forEach((item) => {
                        arr.push(item);
                    });
                    this.setState({
                        applications: arr,
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
        this.fetchingListOfApp();
    }

    render() {
        let arr = this.state.applications;
        if (arr === undefined || arr === 0) {
            return (
                <div className="sidenav-nav">
                </div>
            )
        }
        const appSelected = this.state.currentApp;
        return (
            <div className="sidenav-nav">
                {arr.map((value, index) => {
                    const isSelected = (value === appSelected);
                    return (
                        <MenuItem key={value}
                                  appName={value}
                                  isSelected={isSelected}
                                  onAppSelected={chainedFunction(
                                      this.onItemClick,
                                  )}
                        />
                    );
                })}
            </div>
        );
    }
}

class LogDisplayContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [{
                dataField: 'fluentd_time',
                text: 'Timestamp',
                headerStyle: {
                    width: '20%',
                }
            }, {
                dataField: 'message',
                text: 'Message',
            }],
        }
    }

    fetchingLog = (tag, date, id) => {
        console.log("fetching log");
        let uri = encodeURI('tag=' + tag
            + '&date=' + date
            + '&id=' + id);
        fetch("/log?" + uri)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.code !== 200) {
                    this.setState({
                        data: [],
                    });
                } else {
                    this.setState({
                        data: responseJson.data,
                    });

                }
            })
            .catch(error => {
            })
            .finally(() => {
                this.props.onLoadCompleted();
            })
    };

    componentDidMount() {
        this.reload();
    }

    reload = () => {
        const {
            application,
            date,
        } = this.props;
        if (date === undefined || date === "") {
            return;
        }
        this.fetchingLog(application, date, 0);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('did update application ', this.props, prevProps);
        if (this.props.date !== prevProps.date) {
            this.reload();
        }
    }

    static getDerivedStateFromProps(props, state) {
        console.log('get update application');
        if (props.application !== state.application) {
            return {
                data: [],
                application: props.application,
            };
        }

        if (props.date !== state.date) {
            return {
                data: [],
                date: props.date,
            }
        }
        return null;
    }


    render() {
        const data = this.state.data;
        console.log(data);
        const columns = this.state.columns;
        const options = {
            container: true, // use this scrollable element as a container
            initialState: {
                firstItemIndex: 0, // show first ten items
                lastItemIndex: 9,  // during initial render
            },
        };
        return (
            <div className="message-table">
                {/*<BootstrapTable*/}
                {/*    keyField="id"*/}
                {/*    data={data}*/}
                {/*    columns={columns}*/}
                {/*    bordered={false}*/}
                {/*    headerClasses="message-table-header"*/}
                {/*/>*/}
            </div>
        )
    }
}

class LogDisplayHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: undefined,
            histories: []
        };
    }

    fetchingHistories = (tag) => {
        fetch("/histories?tag=" + tag)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.code === 200) {
                    this.setState({
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
        this.props.onDateSelected(eventKey, eventObject);
        this.setState({
            currentDate: eventKey,
        });
    };

    render() {
        const histories = this.state.histories;
        const title = this.state.currentDate === undefined ? "Select date" : this.state.currentDate;
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
                </div>
            </div>
        );
    }
}

class LogDisplay extends React.Component {

    state = {};

    constructor(props) {
        super(props);
        this.state = {
            date: undefined,
        };
    }

    onDateSelected = (eventKey, eventObject) => {
        console.log(eventKey, eventObject);
        this.setState({
            date: eventKey,
        });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.application !== state.application) {
            return {
                application: props.application,
            };
        }
        return null;
    }

    onLoadMessageCompleted = () => {
        this.props.onLoadCompleted();
    };

    render() {
        let app = this.props.application;
        if (app === undefined || app === "") {
            return (<React.Fragment></React.Fragment>);
        }
        return (
            <Card className="full-screen">
                <Card.Body>
                    <LogDisplayHeader
                        application={app}
                        onDateSelected={this.onDateSelected}/>
                    <LogDisplayContent
                        application={app}
                        onLoadCompleted={this.onLoadMessageCompleted}
                        date={this.state.date}
                    />
                </Card.Body>
            </Card>
        )
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            application: undefined
        }
    }

    onAppSelected = (application) => {
        this.setState({
            isActive: true,
            application: application,
        });
    };

    onLoadCompleted = () => {
        console.log("loading complete");
    }

    render() {
        return (
            <div className="app">
                <header className="header">
                </header>
                <Container fluid>
                    <Row>
                        <Col mx={2} lg={2} xl={2}>
                            <LeftMenu onAppSelected={this.onAppSelected}/>
                        </Col>

                        <Col mx={10} lg={10} xl={10}>
                            <div className="log-display">
                                <LogDisplay
                                    application={this.state.application}
                                    onLoadCompleted={this.onLoadCompleted}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <footer className="footer">
                </footer>
            </div>
        )
    }
}

export default App;
