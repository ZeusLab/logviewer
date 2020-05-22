import React from "react";
import {compose} from "recompose";
import {ListComponent, ListComponent2, withInfiniteScroll, withLoading} from "./ListComponent";

export default class LogDisplayContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            date: undefined,
            application: undefined,
        };
        this.lastIndex = 0;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.application !== state.application
            || props.date !== props.date) {
            return {
                data: [],
                application: props.application,
                date: props.date,
            };
        }
        return null;
    }

    fetchingLog = (tag, date, id) => {
        console.log('fetching log of app = ' + tag + ' on date ' + date + ' from id ' + id);
        let uri = encodeURI('tag=' + tag
            + '&date=' + date
            + '&id=' + id);
        fetch("/api/logs?" + uri)
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code !== 200) {
                } else {
                    this.onSetResult(responseJson.data);
                }
            })
            .catch(error => {
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
            this.setState({
                data: result,
            })
        } else {
            const arr = [...this.state.data, result]
            this.setState({
                data: arr,
            })
        }
        this.lastIndex = result[result.length - 1].id;
    };

    loadMore = () => {
        const {
            application,
            date,
        } = this.props;
        if (date === undefined || date === "") {
            return;
        }
        this.fetchingLog(application, date, this.lastIndex);
    };

    initialize = () => {
        this.lastIndex = 0;
        const {
            application,
            date,
        } = this.props;
        if (date === undefined || date === "") {
            return;
        }
        this.fetchingLog(application, date, 0);
    };

    render() {
        const {
            data,
        } = this.state;
        console.log(data);
        const ListWithLoadingWithInfinite = compose(
            withInfiniteScroll,
            withLoading,
        )(ListComponent);
        return (
            <div className="message-table" id="log-display-table">
                <div className="message-table-header">
                    <div className="th timestamp">Timestamp</div>
                    <div className="th message">Message</div>
                </div>
                <div className="scroll-list-container">
                    <ListComponent2
                        application={this.props.application}
                        items={data}
                        initialize={this.initialize}
                        loadMore={this.loadMore}
                    />
                </div>
            </div>
        )
    }
}