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

        componentDidMount() {
            document.getElementById('scroll-list').addEventListener('scroll', this.onScroll, false);
            if (this.props.items === undefined || this.props.items.length === 0) {
                if (this.props.initialize !== undefined) {
                    this.props.initialize();
                }
            }
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
            return <Component {...this.props} style={{height: 100, maxHeight: 100}} onscroll={this.onScroll}/>
        }
    };

const ListItem = (props) => {
    return (
        <div className="scroll-list-item">
            <div className="timestamp">
                <Moment format="YYYY-MM-DD HH:mm:ss,SSS">
                    {props.item.fluentd_time}
                </Moment>
            </div>
            <div className="message">{props.item.message}</div>
            <div className="separated-line"/>
        </div>
    )
};


const ListComponent = ({application, items}) => {
    console.log(items);
    const listItems = items.map((item, index) =>
        <ListItem key={item.id} item={item} index={index}/>
    );
    return (
        <div className="scroll-list" key={application} id="scroll-list">
            {listItems}
        </div>
    );
};


export {
    ListComponent,
    withInfiniteScroll,
    withLoading,
}