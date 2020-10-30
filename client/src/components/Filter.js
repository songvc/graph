import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'

const Filter = (props) => {
    const { setTimeFilter } = props;
    const filterOptions = ['year', 'month', 'week', 'day', 'hour'];
    const filterOptionObject = filterOptions.map((item, i) => ({ key: i, text: item, value: item }))
    const filterDefaultOption = { key: 0, text: 'n/a', value: 'n/a ' };
    const [selected, setSelected] = useState(filterOptionObject[0] || filterDefaultOption);

    const handleClick = (event, result) => {
        const { value } = result;
        const findSelection = filterOptionObject.find((option) => option.value === value);
        setSelected(findSelection);
        setTimeFilter(value);
    }

    return <div>
        <Dropdown
            placeholder='Time Scale'
            search
            fluid
            value={selected.value}
            selection
            options={filterOptionObject}
            onChange={handleClick} />
    </div>
}


export default Filter;