import React from 'react';
import {ReactComponent as Logo} from './assets/logo.svg';
import {
    Container,
    Row,
    Col,
} from 'react-bootstrap';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import "./index.styl";
import LogDisplay from "./LogDisplay";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app">
                <header className="header">
                    <Logo className="logo"/>
                </header>
                <Container fluid>
                    <Row>
                        <Col mx={12} lg={12} xl={12}>
                            <div className="log-display">
                                <LogDisplay/>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <footer className="footer">
                    <span>© 2020 <a href="https://github.com/hermes-solution">Hermes</a></span>
                </footer>
            </div>
        )
    }
}

export default App;
