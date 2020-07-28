import React from 'react';
import {Dropdown} from 'semantic-ui-react';

function DropdownMultipleSelection(props) {
	const opts = props.options;
	return (
		<Dropdown
			placeholder='Select log level'
			fluid
			multiple
			className="dropdown-multi"
			selection
			options={opts}/>
	);
}

export default DropdownMultipleSelection;