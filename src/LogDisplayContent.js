import React from "react";
import Moment from "react-moment";
import Emitter from './services/emitter';

class List extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			items: [],
		};
	}
	
	clearMessages = () => {
		this.setState({
			items: [],
		});
	};
	
	addMessages = (items, scrollToBottom) => {
		this.setState(state => {
			const list = state.items.concat(...items);
			return {
				items: list,
			}
		});
		if (scrollToBottom) {
			this.scrollToBottom();
		}
	};
	
	scrollToBottom = () => {
		const element = document.getElementById('scroll-list');
		element.scrollTop = element.scrollHeight - element.clientHeight;
	};
	
	render() {
		if (this.state.items === undefined) {
			return (
				<React.Fragment/>
			)
		}
		const listItems = this.state.items.map((item, index) => {
			return (
				<div className="scroll-list-item" key={item.id}>
					<div className="timestamp">
						<Moment format="YYYY-MM-DD HH:mm:ss,SSS">
							{item.fluentd_time}
						</Moment>
					</div>
					<div className="message">{item.message}</div>
					<div className="separated-line"/>
				</div>
			)
		});
		return (
			<div className="scroll-list"
			     id="scroll-list">
				{listItems}
			</div>
		);
	}
}

export default class LogDisplayContent extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			application: undefined,
		};
		this.lastIndex = 0;
		this.currentDate = undefined;
		this.list = React.createRef();
		this.refresh = undefined;
	}
	
	// componentDidUpdate(prevProps, prevState, snapshot) {
	//     if (prevProps.application !== this.state.application) {
	//         if (this.refresh !== undefined) {
	//             clearInterval(this.refresh);
	//         }
	//         if (this.list !== undefined) {
	//             this.list.current.clearMessages();
	//         }
	//         return;
	//     }
	//     this.lastIndex = 0;
	//     this.retrieveLog();
	// }
	//
	// static getDerivedStateFromProps(props, state) {
	//     if (props.application !== state.application) {
	//         return {
	//             data: [],
	//             application: props.application,
	//             date: undefined,
	//         };
	//     }
	//     return null;
	// }
	//
	// onSetResult = (result) => {
	//     if (result.length === 0) {
	//         return;
	//     }
	//     if (this.list !== undefined) {
	//         if (this.lastIndex === 0) {
	//             this.list.current.clearMessages();
	//         }
	//         this.list.current.addMessages(result, true);
	//     }
	//     this.lastIndex = result[result.length - 1].id;
	// };
	
	componentDidMount() {
		Emitter.on('LogLevel', (newValue) => {
			console.log(newValue);
		});
	}
	
	componentWillUnmount() {
		Emitter.off('LogLevel');
	}
	
	render() {
		return (
			<div className="message-table" id="log-display-table">
				<div className="scroll-list-container">
					<List ref={this.list}
					      action={this.state.action}/>
				</div>
			</div>
		)
	}
}