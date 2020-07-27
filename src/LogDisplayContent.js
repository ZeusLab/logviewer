import React, {useState} from "react";
import Moment from "react-moment";
import {REFRESH_OFF} from "./LogDisplayHeader";

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

    setupRefresh = (value) => {
        if (this.refresh !== undefined) {
            clearInterval(this.refresh);
            this.refresh = undefined;
        }
        if (value === 0) {
            return;
        }
        this.refresh = setInterval(this.retrieveLog, value * 1000)
    };

    resetOption = () => {
        this.lastIndex = 0;
        if (this.list !== undefined) {
            this.list.current.clearMessages();
        }
        this.currentDate = undefined;
    };

    changeDate = (date) => {
        if (date !== this.currentDate) {
            if (this.refresh !== undefined) {
                clearInterval(this.refresh);
            }
            this.currentDate = date;
            this.lastIndex = 0;
            this.retrieveLog();
        }
    };

    retrieveLog = () => {
        const {
            application,
        } = this.state;
        this.fetchingLog(application, this.currentDate, this.lastIndex);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.application !== this.state.application) {
            if (this.refresh !== undefined) {
                clearInterval(this.refresh);
            }
            if (this.list !== undefined) {
                this.list.current.clearMessages();
            }
            return;
        }
        this.lastIndex = 0;
        this.retrieveLog();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.application !== state.application) {
            return {
                data: [],
                application: props.application,
                date: undefined,
            };
        }
        return null;
    }

    fetchingLog = (tag, date, id) => {
        const uri = encodeURI('tag=' + tag
            + '&date=' + date
            + '&id=' + id
            + '&limit=1');
        fetch("/api/logs?" + uri)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                if (responseJson.code !== 200) {
                } else {
                    this.onSetResult(responseJson.data);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.props.onLoadCompleted();
            })
    };

    onSetResult = (result) => {
        if (result.length === 0) {
            return;
        }
        if (this.list !== undefined) {
            if (this.lastIndex === 0) {
                this.list.current.clearMessages();
            }
            this.list.current.addMessages(result, true);
        }
        this.lastIndex = result[result.length - 1].id;
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