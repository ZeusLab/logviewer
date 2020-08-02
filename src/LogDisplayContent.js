import React from "react";
import Moment from "react-moment";
import Emitter from './services/emitter';
import Socket from "./services/socket";

class List extends React.Component {
	
	constructor(props) {
		super(props);
		this.size = 100;
		this.state = {
			items: [],
			lastId: 0,
		};
		this.dataSource = [];
	}
	
	clearMessages = () => {
		this.dataSource = [];
		this.setState({
			items: [],
			lastId: 0,
		});
	};
	
	componentDidMount() {
		const element = document.getElementById('scroll-list');
		const itemSize = 2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
		this.size = Math.max(Math.ceil(element.clientHeight / itemSize) * 2, 100);
	}
	
	setDataSource = (items) => {
		this.dataSource = this.dataSource.concat(...items);
		this.appendLogForViewing();
	};
	
	appendLogForViewing = () => {
		const {
			items,
		} = this.state;
		
		if (items.length === this.dataSource.length) {
			return;
		}
		
		const startedPoint = items.length;
		const data = this.dataSource.slice(startedPoint, startedPoint + this.size);
		if (data.length === 0) {
			return;
		}
		this.setState({
			items: items.concat(...data),
			lastId: data[data.length - 1].id_str,
		})
	};
	
	scrollToBottom = () => {
		const element = document.getElementById('scroll-list');
		element.scrollTop = element.scrollHeight - element.clientHeight;
	};
	
	onScroll = (e) => {
		const element = e.target;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			// do something at end of scroll
			this.appendLogForViewing();
		}
	};
	
	evenOrOddLine = (index) => {
		if (index % 2 === 0) {
			return "scroll-list-item";
		}
		return "scroll-list-item odd";
	};
	
	logLevelColor = (level) => {
		if (level === "ERROR" || level === "CRITICAL" || level === "ALERT" || level === "EMERGENCY") {
			return "log_level text-danger"
		}
		if (level === "NOTICE" || level === "WARN") {
			return "log_level text-warning"
		}
		return "log_level text-success"
	};
	
	
	render() {
		if (this.state.items === undefined) {
			return (
				<React.Fragment/>
			)
		}
		const listItems = this.state.items.map((item, index) => {
			return (
				<div className={this.evenOrOddLine(index)} key={item.id_str}>
					<div className="timestamp">
						<Moment format="YYYY-MM-DD HH:mm:ss,SSS">
							{item.timestamp}
						</Moment>
					</div>
					<div className={this.logLevelColor(item.level)}>{item.level}</div>
					<div className="message">{item.message}</div>
				</div>
			)
		});
		return (
			<div className="scroll-list"
			     onScroll={this.onScroll}
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
		this.connectWs();
		Emitter.on('query', this.sendQuery);
	}
	
	connectWs() {
		let ws = new WebSocket('ws://localhost:8080/ws');
		let socket = new Socket(ws);
		socket.on('connect', this.onConnect);
		socket.on('disconnect', this.onDisconnect);
		socket.on('error', this.onError);
		socket.on('logs', this.onReceiveLogs);
		this.setState({
			socket: socket,
		})
	}
	
	onError = () => {
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
			if (this.list !== undefined) {
				this.list.current.clearMessages();
			}
			this.state.socket.emit('query', msg);
		} catch (e) {
			this.closeSocket();
			this.onError();
		}
	};
	
	componentWillUnmount() {
		this.closeSocket();
		Emitter.off('query');
	}
	
	closeSocket() {
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
	onReceiveLogs = (data) => {
		const obj = JSON.parse(data);
		if (obj.code !== 200) {
			return;
		}
		if (this.list !== undefined && obj.data && obj.data.length > 0) {
			this.list.current.setDataSource(obj.data);
		}
	};
	
	//checking connection
	checkConnection() {
		const ws = this.state.socket;
		if (!ws) {
			return;
		}
		if (ws.ws.readyState === WebSocket.CLOSED) {
			this.closeSocket();
			this.onError();
			return;
		}
		try {
			ws.emit('ping', "hermes");
			setTimeout(() => {
				this.checkConnection();
			}, 10000); //call check function after timeout
		} catch (e) {
			this.closeSocket();
			this.onError();
		}
	}
	
	// onConnect sets the state to true indicating the socket has connected
	//    successfully.
	onConnect = () => {
		setTimeout(() => {
			this.checkConnection();
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