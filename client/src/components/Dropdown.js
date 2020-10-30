import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
    margin-right: 10px;
`;

const Dropdowns = (props) => {
    const { optionsObject, setFilterState, filterState } = props;
    const defaultOption = { key: 0, text: 'n/a', value: 'n/a ' };
    const [selected, setSelected] = useState(optionsObject[filterState] || defaultOption);

    const handleClick = (event, result) => {
        const { value } = result;
        const findSelection = optionsObject.find((option) => option.value === value);
        const { key } = findSelection;
        setSelected(findSelection);
        setFilterState(key);
    }

    return <Container>
        <Dropdown
            placeholder='State'
            search
            fluid
            value={selected.value}
            selection
            options={optionsObject}
            onChange={handleClick} />
    </Container>
}

export default Dropdowns;