import React from 'react';
import {Dropdown} from 'semantic-ui-react';

function DropdownMultipleSelection(props) {
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
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
			fluid
			multiple
			className="dropdown-multi"
			selection
			options={options}/>
	);
}

export default DropdownMultipleSelection;