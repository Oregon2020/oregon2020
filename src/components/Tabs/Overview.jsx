import React from 'react'
import {
    Button, Checkbox, Dropdown, Form, Grid, Header, List, Modal, Table
} from 'semantic-ui-react'

import sankey from '../Diagrams/Sankey'
import Candidate from '../Candidate'


class Senate extends React.Component {
    constructor(props) {
        super(props)

        const bills = {}
        this.billsDropdownOptions = []
        Object.entries(props.data.bills).forEach(([id, title]) => {
            bills[id] = { title, vote: null }
            this.billsDropdownOptions.push({ text: title, value: id })
        })

        this.state = {
            bills,
            searchedBills: [],
            selectedCandidate: null
        }
    }

    componentDidMount() {
        this.renderSankey()
    }

    getData = (filter) => {
        const data = {
            nodes: [],
            links: []
        }

        let source
        const { candidates } = this.props.data
        if (filter && filter.type === 'candidate') {
            source = [candidates.find(c => c.id === filter.id)]
        } else {
            source = candidates
        }

        for (let i = source.length; i--;) {
            const {
                id,
                firstName,
                lastName,
                photo,
                bills,
                finance
            } = source[i]
            if (
                !filter ||
                filter.type !== 'bills' ||
                Object.entries(bills).filter(([billId, vote]) => filter.bills[billId] && vote === filter.bills[billId]).length
            ) {
                data.nodes.push(
                    {
                        id,
                        name: `${firstName} ${lastName}`,
                        type: 'candidate',
                        photo
                    }
                )
                const candidateNodeIdx = data.nodes.length - 1

                let financeSectors = Object.entries(finance.sector).sort((s1, s2) => s1[1] > s2[1])
                if (filter && filter.type === 'bills') {
                    financeSectors = financeSectors.slice(0, 5)
                }
                financeSectors.forEach(([name, value]) => {
                    if (
                        !filter ||
                        filter.type !== 'sector' ||
                        (filter.type === 'sector' && filter.id === name)
                    ) {
                        let target = data.nodes.findIndex(v => v.name === name)
                        if (target === -1) {
                            data.nodes.push(
                                { name, type: 'sector', id: name }
                            )
                            target = data.nodes.length - 1
                        }
                        data.links.push({
                            source: candidateNodeIdx,
                            target,
                            value
                        })
                    }
                })
            }
        }
        return data
    }

    renderSankey = (filter) => {
        this.setState({ hasFilter: !!filter })
        const data = this.getData(filter)
        sankey({
            container: this.sankeyContainer,
            data,
            size: {
                width: 800,
                height: 1000
            },
            getPopupContent: d => `<br/>${d.name}`,
            onNodeClick: c => this.setState({ selectedCandidate: this.props.data.candidates.find(candidate => candidate.id === c.id) })
        })
    }

    handleBillVoteChange = (billId, value) => {
        this.setState((state) => {
            state.bills[billId].vote = value
            return state
        })
    }

    filterByBills = () => {
        const bills = {}
        Object
            .entries(this.state.bills)
            .forEach(([id, { vote }]) => {
                if (vote) {
                    bills[id] = vote
                }
            })
        if (Object.keys(bills).length) {
            this.renderSankey({ type: 'bills', bills })
        } else if (this.state.hasFilter) {
            this.renderSankey()
        }
    }

    getVoteColor = (vote) => {
        switch (vote) {
            case 'Yea':
                return 'green'
            case 'Nay':
                return 'red'
            case 'Co-sponsor':
                return 'blue'
            case 'No Vote':
            default:
                return 'yellow'
        }
    }

    render() {
        const { candidates } = this.props.data
        const { selectedCandidate } = this.state
        return (
            <React.Fragment>
                <Grid padded relaxed stackable>
                    <Grid.Column width={11}>
                        <Header floated="left" size="medium">Click on a candidate or donor to filter the results by that selected entity</Header>
                        {/*
                        <Button
                            primary
                            floated="right"
                            disabled={!this.state.hasFilter}
                            onClick={() => this.renderSankey()}
                        >
                            Clear filter
                        </Button>
                        */}
                        <div
                            ref={(c) => { this.sankeyContainer = c }}
                            style={{ height: 'auto', width: 800, marginTop: 50 }}
                        />
                    </Grid.Column>

                    <Grid.Column width={5}>
                        <Header>How to filter by bill?</Header>
                        <List ordered>
                            <List.Item>
                                First find the bills you are interested in
                            </List.Item>
                            <List.Item>
                                Then adjust the votes to those bills
                            </List.Item>
                            <List.Item>
                                Finally click on <b>&quot;Filter&quot;</b> button to see candidates who voted according to your selected
                                criteria
                            </List.Item>
                        </List>
                        <Form>
                            <Form.Group inline>
                                <Form.Field>
                                    <label><b>Find Bills:</b>&nbsp;</label>
                                    <Dropdown
                                        multiple
                                        search
                                        selection
                                        options={this.billsDropdownOptions}
                                        onChange={(e, { value }) => this.setState({ searchedBills: value })}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                        <Table textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan={2} />
                                    <Table.HeaderCell>
                                        {/* <Button primary onClick={this.filterByBills}>Filter</Button> */}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell colSpan={candidates.length}>
                                        How they votes?
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        Bill Number
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Title
                                    </Table.HeaderCell>
                                    {/* <Table.HeaderCell>Vote:</Table.HeaderCell> */}
                                    {candidates.map(c => (
                                        <Table.HeaderCell key={c.id}>
                                            {`${c.firstName} ${c.lastName}`}
                                        </Table.HeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {Object
                                    .entries(this.state.bills)
                                    .filter(([billId]) => this.state.searchedBills.length === 0 || this.state.searchedBills.indexOf(billId) > -1)
                                    .map(([billId, { title }]) => (
                                        <Table.Row key={billId}>
                                            <Table.Cell>{billId}</Table.Cell>
                                            <Table.Cell textAlign="left">{title}</Table.Cell>
                                            {/*
                                            <Table.Cell>
                                                <Form>
                                                    <Form.Group inline>
                                                        <Form.Field>
                                                            <Checkbox
                                                                radio
                                                                label="Yea"
                                                                checked={vote === 'Yea'}
                                                                onChange={() => this.handleBillVoteChange(billId, 'Yea')}
                                                            />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Checkbox
                                                                radio
                                                                label="Nay"
                                                                checked={vote === 'Nay'}
                                                                onChange={() => this.handleBillVoteChange(billId, 'Nay')}
                                                            />
                                                        </Form.Field>
                                                        {vote ?
                                                            (
                                                                <Form.Field>
                                                                    <Button
                                                                        icon="remove"
                                                                        color="red"
                                                                        circular
                                                                        size="mini"
                                                                        onClick={() => this.handleBillVoteChange(billId, null)}
                                                                    />
                                                                </Form.Field>
                                                            ) :
                                                            (
                                                                <div style={{ width: 20 }} />
                                                            )
                                                        }
                                                    </Form.Group>
                                                </Form>
                                            </Table.Cell>
                                            */}
                                            {candidates.map(c => (
                                                <Table.Cell key={c.id} style={{ backgroundColor: this.getVoteColor(c.bills[billId]) }}>
                                                    {c.bills[billId] ? c.bills[billId] : 'No Vote'}
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
                <Modal
                    size="fullscreen"
                    open={!!selectedCandidate}
                    onClose={() => this.setState({ selectedCandidate: null })}
                >
                    {selectedCandidate ?
                        (
                            <React.Fragment>
                                <Modal.Header>{`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}</Modal.Header>
                                <Modal.Content>
                                    <Candidate {...selectedCandidate} allBills={this.props.data.bills} />
                                </Modal.Content>
                            </React.Fragment>
                        ) :
                        null
                    }
                </Modal>
            </React.Fragment>
        )
    }
}

export default Senate
