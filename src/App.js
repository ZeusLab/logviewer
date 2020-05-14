import React, {PureComponent} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
} from 'react-bootstrap';
import './App.css';
import chainedFunction from 'chained-function';
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
        console.log('onitem click ' + application);
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
                    console.log(arr);
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
                    const isSelected = (value === appSelected) ? true : false;
                    return (
                        <MenuItem key={value}
                                  appName={value}
                                  isSelected={isSelected}
                                  onAppSelected={chainedFunction(
                                      this.onItemClick,
                                      this.onAppSelected,
                                  )}
                        />
                    );
                })}
            </div>
        );
    }
}

class LogDisplay extends React.Component {

    constructor(props) {
        super(props);
        let app = props.application;
        this.state = {
            application: app,
        }
    }

    changeApplication = (application) => {
        console.log("----------------" + application);
        this.fetchingHistories(application)
    };

    fetchingHistories = (tag) => {
        fetch("/histories?tag=" + tag)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code === 200) {
                    this.fetchingLog(tag, responseJson.data[0], 0)
                    this.setState({
                        application: tag,
                    })
                } else {
                    /**
                     * alert log
                     */
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
            })
    };

    fetchingLog = (tag, date, id) => {
        let uri = encodeURI('tag=' + tag
            + '&date=' + date
            + '&id=' + id);
        fetch("/log?" + uri)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code !== 200) {
                } else {
                    /**
                     * alert log
                     */
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
            })
    };

    componentDidMount() {
        /**
         * do nothing now
         */
    }

    render() {
        let app = this.state.application;
        if (app === undefined || app === "") {
            return (<Card className="full-screen">
                <Card.Body className="empty-log">
                    <p>Select application</p>
                </Card.Body>
            </Card>);
        }
        return (
            <Card className="full-screen">
                <Card.Body className="empty-log">
                    {this.state.application}
                </Card.Body>
            </Card>
        )
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.currentApp = React.createRef();
    }

    onAppSelected = (application) => {
        console.log('change application ' + application);
        this.currentApp.current.changeApplication(application);
    };

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
                                <LogDisplay ref={this.currentApp}/>
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
