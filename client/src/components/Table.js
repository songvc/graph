import React, { useState } from 'react';
// import Pagination from './Pagination';
import Row from './Row';
import { Pagination } from 'semantic-ui-react'
import { Table } from 'semantic-ui-react'

const Tables = (props) => {
    const [index, setIndex] = useState(0);

    const { data } = props;

    const pageNum = data['index'];
    const currentPage = data[index];

    const handlePageChange = (e, { activePage }) => {
        setIndex(activePage);
    }

    const PaginationProps = {
        defaultActivePage: 5,
        totalPages: pageNum,
        onPageChange: handlePageChange
    };

    return <Table celled>
        <Table.Header>
            <Table.Row>
                {currentPage[0] && Object.keys(currentPage[0]).map((header, i) => {
                    return <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                })}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {currentPage && currentPage.map((item, i) => {
                return <Row key={i} {...item} />
            })}
        </Table.Body>
        <Table.Footer>
            <Pagination {...PaginationProps} />
        </Table.Footer>
    </Table>
}

export default Tables;
