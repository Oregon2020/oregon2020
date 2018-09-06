import React from 'react'
import {
    Button, Checkbox, Dropdown, Form, Grid, Header, List, Table
} from 'semantic-ui-react'

import OR_SENATE from '../../data/or_senate.json'
import sankey from '../Diagrams/Sankey'

const FOLLOW_THE_MONEY_CATEGORIES = {
    'd-cci': { label: 'industry', accessKey: 'General_Industry', nameField: 'General_Industry' },
    'd-ccg': { label: 'sector', accessKey: 'Broad_Sector', nameField: 'Broad_Sector' },
    'd-eid': { label: 'contributor', accessKey: 'Contributor', nameField: 'Contributor' }
}

const CANDIDATES_OF_INTEREST = [
    '46654',     // Arnie Roblan
    '10706',     // Ginny Burdick
    '46683',     // Mark Hass
]

const BILLS = {}
const BILLS_DROPDOWN_OPTIONS = []
const BILLS_OF_INTEREST = [
    'HB 4155',
    'HB 4145',
    'HJR 203',
    'HB 2355',
    'HB 3464',
    'HB 3391',
    'SB 558',
    'SB 3',
    'HB 2004',
    'SB 1547',
    'SB 1532',
    'SB 932',
    'SB 478',
    'SB 454',
    'HB 2307',
    'SB 941',
    'HB 2177'
]

Object
    .values(OR_SENATE)
    .filter(candidate => CANDIDATES_OF_INTEREST.indexOf(candidate.candidateId) > -1)
        .forEach((candidate) => {
        candidate.bills.forEach((bill) => {
            const {
                billId, billNumber, office, title
            } = bill
            if (BILLS_OF_INTEREST.indexOf(billNumber) > -1 && !BILLS[billId]) {
                BILLS[billId] = {
                    billNumber,
                    office,
                    title,
                    vote: null
                }
                BILLS_DROPDOWN_OPTIONS.push({ text: title, value: billId })
            }
        })
    })

class Senate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            bills: BILLS,
            searchedBills: []
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
        if (filter && filter.type === 'candidate') {
            source = [[filter.id, OR_SENATE[filter.id]]]
        } else {
            source = Object
                .entries(Object.assign({}, OR_SENATE))
                .filter(([candidateId]) => CANDIDATES_OF_INTEREST.indexOf(candidateId) > -1)
        }

        for (let i = source.length; i--;) {
            const [candidateId, candidate] = source[i]
            if (
                !filter ||
                filter.type !== 'bills' ||
                candidate.bills.filter(b => filter.bills[b.billId] && b.vote === filter.bills[b.billId]).length
            ) {
                data.nodes.push(
                    {
                        id: candidateId,
                        name: `${candidate.firstName} ${candidate.lastName}`,
                        type: 'candidate',
                        photo: candidate.photo
                    }
                )
                const candidateNodeIdx = data.nodes.length - 1

                Object.entriecandidateNodeIdxs(FOLLOW_THE_MONEY_CATEGORIES).forEach(([code, { accessKey, nameField }]) => {
                    candidate.finance[code].forEach((record) => {
                        const amount = parseFloat(record.Total_$.Total_$)
                        if (code === 'd-ccg') {
                            if (
                                !filter ||
                                filter.type !== 'sector' ||
                                (filter.type === 'sector' && filter.id === record[accessKey].id)
                            ) {
                                const sectorName = record[accessKey][nameField]
                                let target = data.nodes.findIndex(v => v.name === sectorName)
                                if (target === -1) {
                                    data.nodes.push(
                                        { name: record[accessKey][nameField], type: 'sector', id: record[accessKey].id }
                                    )
                                    target = data.nodes.length - 1
                                }
                                data.links.push({
                                    source: candidateNodeIdx,
                                    target,
                                    value: amount
                                })
                            }
                        }
                    })
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
            onNodeClick: this.renderSankey
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
            .forEach(([billId, { vote }]) => {
                if (vote) {
                    bills[billId] = vote
                }
            })
        if (Object.keys(bills).length) {
            this.renderSankey({ type: 'bills', bills })
        } else if (this.state.hasFilter) {
            this.renderSankey()
        }
    }

    render() {
        return (
            <Grid padded relaxed stackable>
                <Grid.Column width={11}>
                    <Header floated="left" size="medium">Click on a candidate or donor to filter the results by that selected entity</Header>
                    <Button
                        primary
                        floated="right"
                        disabled={!this.state.hasFilter}
                        onClick={() => this.renderSankey()}
                    >
                        Clear filter
                    </Button>
                    {}
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
                                    options={BILLS_DROPDOWN_OPTIONS}
                                    onChange={(e, { value }) => this.setState({ searchedBills: value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Button primary onClick={this.filterByBills}>Filter</Button>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    Bill Number
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Title
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Vote:
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {Object
                                .entries(this.state.bills)
                                .filter(([billId]) => this.state.searchedBills.length === 0 || this.state.searchedBills.indexOf(billId) > -1)
                                .map(([billId, { billNumber, title, vote }]) => (
                                    <Table.Row key={billId}>
                                        <Table.Cell>{billNumber}</Table.Cell>
                                        <Table.Cell>{title}</Table.Cell>
                                        <Table.Cell>
                                            <Form>
                                                <Form.Group inline>
                                                    <Form.Field>
                                                        <Checkbox
                                                            radio
                                                            label="Yea"
                                                            checked={vote === 'Y'}
                                                            onChange={() => this.handleBillVoteChange(billId, 'Y')}
                                                        />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <Checkbox
                                                            radio
                                                            label="Nay"
                                                            checked={vote === 'N'}
                                                            onChange={() => this.handleBillVoteChange(billId, 'N')}
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
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Senate
