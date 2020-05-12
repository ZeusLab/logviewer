import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import './App.css';


class App extends React.Component {

    constructor(props) {
        super(props);
    }

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
    }

    fetchingListOfApp = () => {
        fetch("/application")
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code === 200) {
                    this.fetchingHistories(responseJson.data[0])
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
        this.fetchingListOfApp()
    }

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
                            </Col>

                            <Col mx={10} lg={10} xl={10}>
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
