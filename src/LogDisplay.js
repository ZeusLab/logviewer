import React from "react";
import {Card} from "react-bootstrap";
import LogDisplayHeader from "./LogDisplayHeader";
import LogDisplayContent from "./LogDisplayContent";
import DropdownMultipleSelection from "./DropdownMultipleSelection";

export default class LogDisplay extends React.Component {

    constructor(props) {
        super(props);
        // this.displayContentRef = React.createRef();
    }

    // onDateSelected = (eventKey, eventObject) => {
    //     if (this.displayContentRef !== undefined) {log-viewer
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
        return (
            <Card className="full-screen">
                <Card.Body>
                    <LogDisplayHeader/>
                    {/*<LogDisplayContent/>*/}
                </Card.Body>
            </Card>
        )
    }
}