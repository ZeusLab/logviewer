import React from "react";
import {Card} from "react-bootstrap";
import LogDisplayHeader from "./LogDisplayHeader";
import LogDisplayContent from "./LogDisplayContent";

export default class LogDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: undefined,
            action: 'tail',
            refreshConfig: 0,
        };
        this.displayContentRef = React.createRef();
    }

    onDateSelected = (eventKey, eventObject) => {
        this.setState({
            date: eventKey,
        });
    };

    onActionSelected = (eventKey, eventObject) => {
        this.setState({
            action: eventKey,
        });
    };

    onRefreshConfigSelected = (eventKey, eventObject) => {
        this.setState({
            refreshConfig: eventKey,
        });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.application !== state.application) {
            return {
                date: undefined,
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
            return (<React.Fragment/>);
        }
        return (
            <Card className="full-screen">
                <Card.Body>
                    <LogDisplayHeader
                        application={app}
                        onDateSelected={this.onDateSelected}
                        onRefreshConfigSelected={this.onRefreshConfigSelected}
                        onActionSelected={this.onActionSelected}
                    />
                    <LogDisplayContent
                        application={app}
                        ref={this.displayContentRef}
                        onLoadCompleted={this.onLoadMessageCompleted}
                        date={this.state.date}
                        action={this.state.action}
                        refresh={this.state.refreshConfig}
                    />
                </Card.Body>
            </Card>
        )
    }
}