import React, {Component, PureComponent} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
} from 'react-bootstrap';
import './App.css';
import "./index.styl";
import LeftMenu from "./LeftMenu";
import LogDisplay from "./LogDisplay";

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
