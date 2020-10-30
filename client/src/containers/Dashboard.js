import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Map from '../components/Map';
import Dropdowns from '../components/Dropdown';
// import Filter from '../components/Filter';
import Table from '../components/Table';
import Graph from '../components/Graph';
import GraphInterval from '../components/GraphInterval'
import TotalGraph from '../components/TotalGraph';
import { processArray, mergeCurrentTable, getTotal } from '../utils/utils';
import { Container, Header, Grid, Statistic } from 'semantic-ui-react'
import { stateMap } from '../utils/utils';
import { timeParse } from "d3-time-format";
import { DateInput } from 'semantic-ui-calendar-react';


const DashboardController = () => {
    const [filterState, setFilterState] = useState(0)
    const [data, setData] = useState([])
    const [hash, setHash] = useState({})
    const [timeFilter, setTimeFilter] = useState('year');
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [zoom, setZoom] = useState(1);


    const parser = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    const parser2 = timeParse("%Y-%m-%d");

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/trips");
            const json = await res.json();
            const { data } = json;
            const datas = data.map((item) => ({ ...item, trip_date: (parser(item.trip_date)) }));
            const isArray = Array.isArray(datas)
            isArray && setData(datas);
            isArray && setHash(processArray(datas))
            isArray && setStart(datas[0].trip_date)
            isArray && setEnd(datas[datas.length - 1].trip_date)
        }
        fetchData()
    }, []);

    const options = Object.keys(hash)
    const total = getTotal(data);
    const optionsObject = Object.keys(hash).map((abbrev, i) => {
        return { key: i, text: stateMap[abbrev], value: abbrev }
    });
    const currentFilter = options[filterState];
    const currentTable = hash[currentFilter]
    const mergedTable = currentTable && mergeCurrentTable(currentTable);

    const DropdownProps = {
        optionsObject: optionsObject,
        setFilterState: setFilterState,
        filterState: filterState,
        currentFilter: currentFilter
    }

    // const FilterProps = {
    //     timeFilter: timeFilter,
    //     setTimeFilter: setTimeFilter
    // }

    const MapProps = {
        width: '975',
        height: '610',
        options: options,
        setFilterState: setFilterState,
        filterState: filterState,
        currentFilter: currentFilter
    }

    const TableProps = {
        data: currentTable
    }

    const GraphProps = {
        width: '500',
        height: '400',
        margins: 25,
        data: mergedTable,
        timeFilter: timeFilter,
        setTimeFilter: setTimeFilter,
        start: start,
        end: end,
        setStart: setStart,
        setEnd: setEnd,
        zoom: zoom,
        setZoom: setZoom
    }

    const GraphIntervalProps = {
        width: '500',
        height: '100',
        margins: 25,
        data: mergedTable,
        timeFilter: timeFilter,
        setTimeFilter: setTimeFilter,
        start: start,
        end: end,
        setStart: setStart,
        setEnd: setEnd,
        zoom: zoom,
        setZoom: setZoom
    }

    const TotalGraphProps = {
        width: '500',
        height: '500',
        margins: 25,
        data: hash,
        currentFilter: currentFilter
    }

    const handleStart = (date, e) => {
        const parsed = parser2(e.value);
        setStart(parsed)
    }
    const handleEnd = (date, e) => {
        const parsed = parser2(e.value);
        setEnd(parsed)
    }

    return (
        <Container>
            <Header>Graph</Header>
            <Grid columns={4} divided>
                <Grid.Row>
                    <Grid.Column>
                        <Header>State:</Header> 
                        {options && options.length > 0 ? <Dropdowns {...DropdownProps} /> : <Loading />}
                    </Grid.Column>
                    {/* <Grid.Column>
                        <Header>Scale By:</Header>
                        {options && options.length > 0 ? <Filter {...FilterProps} /> : <Loading />}
                    </Grid.Column> */}
                </Grid.Row>
            </Grid>
            <Grid columns={4} divided>
                <Grid.Row>
                    <Grid.Column>
                        <Header>From:</Header> 
                        <DateInput
                            className="field1"
                            dateFormat="YYYY-MM-DD"
                            name="date"
                            placeholder="Start Time"
                            value={start && start}
                            iconPosition="left"
                            popupPosition="bottom left"
                            closable
                            mountNode={document.querySelector('.field1')}
                            onChange={handleStart}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Header>To:</Header> 
                        <DateInput
                            className="field2"
                            dateFormat="YYYY-MM-DD"
                            name="date"
                            placeholder="End Time"
                            value={end && end}
                            iconPosition="left"
                            popupPosition="bottom left"
                            closable
                            mountNode={document.querySelector('.field2')}
                            onChange={handleEnd}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Grid columns={4} divided>
                <Grid.Row>
                    <Grid.Column>
                        <Statistic>
                            <Statistic.Value>{data && (Math.round(total / 1000000)) + 'M'}</Statistic.Value>
                            <Statistic.Label>Total Trip Counts</Statistic.Label>
                        </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                        <Statistic>
                            <Statistic.Value>{currentTable && (Math.round(currentTable['total'] / 1000000)) + "M"}</Statistic.Value>
                            <Statistic.Label>Total {stateMap[currentFilter]} Trip Counts </Statistic.Label>
                        </Statistic>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Grid columns={1} divided>
                <Grid.Row>
                    <Grid.Column>
                        {options && options.length > 0 ? <Map {...MapProps} /> : <Loading />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Header>Table</Header>
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column>
                        {mergedTable && mergedTable.length > 0 ? <Graph {...GraphProps} /> : <Loading />}
                        {mergedTable && mergedTable.length > 0 ? <GraphInterval {...GraphIntervalProps} /> : <Loading />}
                    </Grid.Column>
                    <Grid.Column>
                        {hash && Object.keys(hash).length > 0 ? <TotalGraph {...TotalGraphProps} /> : <Loading />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {currentTable && Object.keys(currentTable).length > 0 ? <Table {...TableProps} /> : <Loading />}
        </Container>)
}

export default DashboardController;