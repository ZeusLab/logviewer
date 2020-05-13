import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Fragment} from 'react';
import './App.css';


class LeftMenu extends React.Component {

    constructor(props) {
        super(props);
        this.onAppSelected = props.onAppSelected;
        this.state = {
            applications: [],
        }
    }

    fetchingListOfApp = () => {
        fetch("/application")
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code === 200) {
                    this.onAppSelected(responseJson.data[0]);
                    let arr = [];
                    responseJson.data.forEach((item) => {
                        arr.push(item);
                    })
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
            return (<div></div>)
        }
        return (
            <Fragment>
                {arr.map((value, index) => {
                    return (
                        <div>{value}</div>
                    );
                })}
            </Fragment>
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
            return (<div></div>);
        }
        return (
            <div>
                <p>{this.state.application}</p>
            </div>
        )
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.currentApp = React.createRef();
    }

    onAppSelected = (application) => {
        this.currentApp.current.changeApplication(application);
    };

    render() {
        return (
            <div className="App">
                <header className="header">
                    LOG VIEWER
                </header>
                <div className="log-viewer">
                    <Container fluid>
                        <Row>
                            <Col mx={2} lg={2} xl={2}>
                                <LeftMenu onAppSelected={this.onAppSelected}/>
                            </Col>

                            <Col mx={10} lg={10} xl={10}>
                                <LogDisplay ref={this.currentApp}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <footer className="footer">
                </footer>
            </div>
        )
    }
}

export default App;
