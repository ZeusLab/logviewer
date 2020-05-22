import React, {Component} from 'react';
import Moment from 'react-moment';

const withLoading = (Component) =>
    class Loading extends React.Component {
        render() {
            return (
                <React.Fragment>
                    <Component {...this.props} />

                    <div className="interactions">
                        {this.props.isLoading && <span>Loading...</span>}
                    </div>
                </React.Fragment>
            )
        }
    };

const withInfiniteScroll = (Component) =>
    class WithInfiniteScroll extends React.Component {
        constructor(props) {
            super(props);
        }

        scrollToBottom = () => {
            //this.list.current.scrollIntoView({behavior: "smooth"});
        }


        componentDidMount() {
            document.getElementById('scroll-list').addEventListener('scroll', this.onScroll, false);
            if (this.props.items === undefined || this.props.items.length === 0) {
                if (this.props.initialize !== undefined) {
                    this.props.initialize();
                }
            }
            this.scrollToBottom();
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            this.scrollToBottom();
        }

        componentWillUnmount() {
            document.getElementById('scroll-list').removeEventListener('scroll', this.onScroll, false);
        }

        onScroll = () => {
            console.log('onscroll');
            console.log(window);
            console.log(window.innerHeight);
            console.log(window.scrollY);
            console.log(document.body.offsetHeight);
            // if (
            //     (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
            //     this.props.list.length
            // ) {
            //     this.props.onPaginatedSearch();
            // }
        }

        render() {
            return <Component {...this.props} onscroll={this.onScroll}/>
        }
    };

const ListComponent = ({application, items}) => {
    const listItems = items.map((item, index) => {
        const ref = React.createRef();
        console.log(ref);
        return (
            <div className="scroll-list-item" ref={ref} key={item.id}>
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
        <div className="scroll-list" key={application} id="scroll-list">
            {listItems}
        </div>
    );
};


class ListComponent2 extends React.Component {

    constructor(props) {
        super(props);
    }

    scrollToBottom = () => {
        //this.list.current.scrollIntoView({behavior: "smooth"});
    };


    componentDidMount() {
        document.getElementById('scroll-list').addEventListener('scroll', this.onScroll, false);
        if (this.props.items === undefined || this.props.items.length === 0) {
            console.log('1');
            if (this.props.initialize !== undefined) {
                console.log('2');
                this.props.initialize();
            }
        }
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        document.getElementById('scroll-list').removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
        console.log('onscroll');
        console.log(window);
        console.log(window.innerHeight);
        console.log(window.scrollY);
        console.log(document.body.offsetHeight);
        // if (
        //     (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
        //     this.props.list.length
        // ) {
        //     this.props.onPaginatedSearch();
        // }
    };

    render() {
        console.log(this.props.items);
        const listItems = this.props.items.map((item, index) => {
            const ref = React.createRef();
            console.log(ref);
            return (
                <div className="scroll-list-item" ref={ref} key={item.id}>
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
        const ref = React.createRef();
        console.log('ref======', ref);
        return (
            <div className="scroll-list"
                key={this.props.application}
                id="scroll-list"
                ref={ref}>
                {listItems}
            </div>
        );
    }
}


export {
    ListComponent2,
    ListComponent,
    withInfiniteScroll,
    withLoading,
}