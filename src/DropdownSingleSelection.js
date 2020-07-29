import React from 'react';
import {Dropdown} from 'semantic-ui-react';

function DropdownSingleSelection(props) {
	const {
		options,
		defaultValue,
		value,
		placeHolder,
		disabled,
		onChange
	} = props;
	return (
		<Dropdown
			placeholder={placeHolder}
			fluid
			disabled={disabled}
			selection
			readOnly={true}
			defaultValue={defaultValue}
			value={value}
			className="dropdown-single"
			options={options}
			onChange={onChange}
		/>
	)
}

export default DropdownSingleSelection;
