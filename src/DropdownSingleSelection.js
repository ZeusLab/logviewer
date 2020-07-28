import React from 'react';
import {Dropdown} from 'semantic-ui-react';

function DropdownSingleSelection(props) {
	const {
		options,
		defaultValue,
		value,
		placeHolder,
		onChange
	} = props;
	return (
		<Dropdown
			placeholder={placeHolder}
			fluid
			selection
			defaultValue={defaultValue}
			value={value}
			className="dropdown-single"
			options={options}
			onChange={onChange}
		/>
	)
}

export default DropdownSingleSelection;
