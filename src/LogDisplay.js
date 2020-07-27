import React from "react";
import {Card} from "react-bootstrap";
import LogDisplayHeader from "./LogDisplayHeader";
import LogDisplayContent from "./LogDisplayContent";

export default class LogDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            application: undefined,
        };
        this.displayContentRef = React.createRef();
    }

    // onDateSelected = (eventKey, eventObject) => {
    //     if (this.displayContentRef !== undefined) {
    //         this.displayContentRef.current.changeDate(eventKey);
    //     }
    // };
    //
    // onActionSelected = (eventKey, eventObject) => {
    //     if (this.displayContentRef !== undefined) {
    //         this.displayContentRef.current.changeAction(eventKey);
    //     }
    // };
    //
    // onRefreshConfigSelected = (eventKey, eventObject) => {
    //     if (this.displayContentRef !== undefined) {
    //         this.displayContentRef.current.setupRefresh(parseInt(eventKey, 10));
    //     }
    // };
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps.application !== this.props.application) {
    //         if (this.displayContentRef !== undefined) {
    //             this.displayContentRef.current.resetOption();
    //         }
    //     }
    // }
    //
    // static getDerivedStateFromProps(props, state) {
    //     if (props.application !== state.application) {
    //         return {
    //             application: props.application,
    //             date: undefined,
    //         };
    //     }
    //     return null;
    // }
    //
    // onLoadMessageCompleted = () => {
    //     this.props.onLoadCompleted();
    // };

    render() {
        const app = this.props.application;
        // if (app === undefined || app === "") {
        //     return (<React.Fragment/>);
        // }
        //
        const {
            date,
        } = this.state;
        return (
            <Card className="full-screen">
                <Card.Body>
                    <LogDisplayHeader
                        application={app}
                        // onDateSelected={this.onDateSelected}
                        // onRefreshConfigSelected={this.onRefreshConfigSelected}
                        // onActionSelected={this.onActionSelected}
                    />
                    <LogDisplayContent
                        application={app}
                        date={date}
                        // onLoadCompleted={this.onLoadMessageCompleted}
                        //
                        // ref={this.displayContentRef}
                        // action={this.state.action}
                    />
                </Card.Body>
            </Card>
        )
    }
}