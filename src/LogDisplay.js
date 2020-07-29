import React from "react";
import {Card} from "react-bootstrap";
import LogDisplayHeader from "./LogDisplayHeader";
import LogDisplayContent from "./LogDisplayContent";
import DropdownMultipleSelection from "./DropdownMultipleSelection";

export default class LogDisplay extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<Card className="full-screen">
				<Card.Body>
					<LogDisplayHeader/>
					<LogDisplayContent/>
				</Card.Body>
			</Card>
		)
	}
}