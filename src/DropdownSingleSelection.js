import React from 'react';
import {Dropdown} from 'semantic-ui-react';

function DropdownSingleSelection(props) {
	const options = props.options;
	return (
		<Dropdown
			placeholder='Select application'
			fluid
			selection
			className="dropdown-single"
			options={options}
		/>
	)
}

export default DropdownSingleSelection;
