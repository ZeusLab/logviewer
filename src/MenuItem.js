import React, {PureComponent} from "react";
import chainedFunction from "chained-function";

export default class MenuItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    handleSelect = (event) => {
        const {
            isSelected,
            appName,
            onAppSelected,
            ...props
        } = this.props;
        if (isSelected) {
            event.preventDefault();
            return;
        }
        onAppSelected(appName);
    };

    render() {
        const {
            onClick,
            appName,
            isSelected,
            ...props
        } = this.props;

        const classNames = isSelected ? "sidenav-navitem highlighted" : "sidenav-navitem";
        return (
            <div className={classNames}
                 onClick={chainedFunction(onClick, this.handleSelect)}>
                <div className="navitem">{appName}</div>
            </div>
        )
    }
}