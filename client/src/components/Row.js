import React from 'react'
import { Table } from 'semantic-ui-react'

const Row = (props) => {
    const { trip_date, home_state, trip_count} = props;
    return <Table.Row>
        <Table.Cell>{trip_date.toString()}</Table.Cell>    
        <Table.Cell>{home_state}</Table.Cell>    
        <Table.Cell>{trip_count}</Table.Cell>    
    </Table.Row>
}

export default Row;