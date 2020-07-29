import React from "react";
import Moment from "react-moment";
import Emitter from './services/emitter';
import Socket from "./services/socket";

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
			connected: false,
			socket: undefined,
		};
		this.list = React.createRef();
	}
	
	componentDidMount() {
		Emitter.on('query', this.handleQuery);
		this.connectWs();
	}
	
	handleQuery = (data) => {
		console.log(data);
		const {
			socket,
			connected
		} = this.state;
		if(!socket || !connected){
			return;
		}
		socket.emit('query', data);
	};
	
	connectWs() {
		console.log('connect');
		let ws = new WebSocket('ws://localhost:8080/ws');
		let socket = new Socket(ws);
		socket.on('connect', this.onConnect);
		socket.on('disconnect', this.onDisconnect);
		socket.on('error', this.onError);
		// event listener to handle 'message' from a server
		socket.on('message', this.onMessage);
		this.setState({
			socket: socket,
		})
	}
	
	onError = () => {
		console.log('error');
		this.setState({
			connected: false,
		});
		setTimeout(() => {
			this.connectWs();
		}, 5000)
	};
	
	sendQuery = (msg) => {
		const {
			connected,
			socket
		} = this.state;
		if (!connected || !socket) {
			return;
		}
		try {
			this.state.socket.emit('query', msg);
		} catch (e) {
			this.closeSocket();
			this.onError();
		}
	};
	
	componentWillUnmount() {
		Emitter.off('query');
		this.closeSocket();
	}
	
	closeSocket() {
		console.log('close');
		const ws = this.state.socket;
		if (!ws) {
			return;
		}
		ws.close();
		this.setState({
			socket: undefined,
		})
	}
	
	//handle message
	onMessage = (data) => {
		console.log('hello from server! message:', data);
	};
	
	//checking connection
	checkConnection() {
		console.log('check connection');
		const ws = this.state.socket;
		if (!ws) {
			return;
		}
		if (ws.ws.readyState === WebSocket.CLOSED) {
			this.closeSocket();
			this.onError();
			return;
		}
		let _this = this;
		setTimeout(() => {
			_this.checkConnection();
		}, 10000); //call check function after timeout
	}
	
	// onConnect sets the state to true indicating the socket has connected
	//    successfully.
	onConnect = () => {
		let _this = this;
		setTimeout(() => {
			_this.checkConnection();
		}, 2000); //call check function after timeout
		this.setState({
			connected: true
		});
	};
	
	// onDisconnect sets the state to false indicating the socket has been
	//    disconnected.
	onDisconnect = () => {
		this.setState({
			connected: false
		});
	};
	
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