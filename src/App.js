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

class LogDisplay extends React.Component {

    constructor(props) {
        super(props);
        const {
            application,
            onLoadCompleted,
        } = this.props;
        this.onLoadCompleted = onLoadCompleted;
        this.state = {
            application: application,
        }
    }

    changeApplication = (application) => {
        this.setState({
            application: application,
        })
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
                if (responseJson.code !== 200) {
                } else {
                    /**
                     * alert log
                     */
                }
            })
            .catch(error => {
            })
            .finally(() => {
                this.onLoadCompleted();
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
            return (<React.Fragment></React.Fragment>);
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
        this.setState({
            isActive: true,
        })
        this.currentApp.current.changeApplication(application);
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
                                    ref={this.currentApp}
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
