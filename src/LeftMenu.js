import React from "react";
import chainedFunction from "chained-function";
import MenuItem from "./MenuItem";

export default class LeftMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            currentApp: undefined,
        };
        this.onAppSelected = this.props.onAppSelected;
        this.currentApp = undefined;
    }

    onItemClick = (application) => {
        this.setState({
            currentApp: application,
        });
        this.onAppSelected(application);
    };

    fetchingListOfApp = () => {
        fetch("/api/applications")
            .then(responseMsg => {
                return responseMsg.json();
            })
            .then(responseJson => {
                if (responseJson.code === 200) {
                    this.onItemClick(responseJson.data[0]);
                    let arr = [];
                    responseJson.data.forEach((item) => {
                        arr.push(item);
                    });
                    this.setState({
                        applications: arr,
                    })
                } else {
                    /**
                     * alert log
                     */
                }
            })
            .catch(error => {
            })
            .finally(() => {
            })
    };

    componentDidMount() {
        this.fetchingListOfApp();
    }

    render() {
        let arr = this.state.applications;
        if (arr === undefined || arr === 0) {
            return (
                <div className="sidenav-nav">
                </div>
            )
        }
        const appSelected = this.state.currentApp;
        return (
            <div className="sidenav-nav">
                {arr.map((value, index) => {
                    const isSelected = (value === appSelected);
                    return (
                        <MenuItem key={value}
                                  appName={value}
                                  isSelected={isSelected}
                                  onAppSelected={chainedFunction(
                                      this.onItemClick,
                                  )}
                        />
                    );
                })}
            </div>
        );
    }
}