import React from "react";
import Moment from "react-moment";
import {ACTION_TAIL} from "./LogDisplayHeader";


class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
        }
    }

    setDataSource = (items) => {
        this.setState({
            items: items,
        });
        this.scrollToBottom();
    };

    scrollToBottom = () => {
        const element = document.getElementById('scroll-list');
        element.scrollTop = element.scrollHeight - element.clientHeight;
    };


    onScroll = (e) => {
        console.log('--------');
        console.log(e);
        const element = e.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            // do something at end of scroll
        }
        console.log(element.scrollHeight);
        console.log(element.scrollTop);
        console.log(element.clientHeight);
        console.log('--------');
        // if (
        //     (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
        //     this.props.list.length
        // ) {
        //     this.props.onPaginatedSearch();
        // }
    };

    render() {
        console.log('items:', this.state.items);
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
        };
        this.data = [];
        this.lastIndex = 0;
        this.currentDate = undefined;
        this.currentAction = ACTION_TAIL;
        this.list = React.createRef();
    }

    setupRefresh = (value) => {

    };

    changeDate = (date) => {
        if (date !== this.currentDate) {
            this.currentDate = date;
            this.lastIndex = 0;
            this.retrieveLog();
        }
    };

    changeAction = (action) => {
        if (action !== this.currentAction) {
            this.currentAction = action;
            this.lastIndex = 0;
            this.retrieveLog();
        }
    };

    retrieveLog = () => {
        const {
            application,
        } = this.state;
        this.fetchingLog(application, this.currentDate, this.currentAction, this.lastIndex);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.application !== this.state.application) {
            if (this.list !== undefined) {
                this.list.current.setDataSource([]);
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
                action: ACTION_TAIL,
            };
        }
        return null;
    }

    fetchingLog = (tag, date, action, id) => {
        const isHead = action === 'head';
        const uri = encodeURI('tag=' + tag
            + '&date=' + date
            + '&id=' + id
            + '&is_head=' + isHead
            + '&limit=1');
        console.log('fetching ' + uri);
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
        if (this.lastIndex === 0) {
            this.data = result;
        } else {
            if (this.state.action === 'tail') {
                this.data = [...this.data, result];
            } else {
                this.data = [...result, this.data];
            }
        }
        if (this.list !== undefined) {
            this.list.current.setDataSource(this.data);
        }
        this.lastIndex = result[result.length - 1].id;
    };

    render() {
        return (
            <div className="message-table" id="log-display-table">
                <div className="message-table-header">
                    <div className="th timestamp">Timestamp</div>
                    <div className="th message">Message</div>
                </div>
                <div className="scroll-list-container">
                    <List ref={this.list}
                          action={this.state.action}/>
                </div>
            </div>
        )
    }
}